import Foundation
import Capacitor
import HealthKit
import WatchConnectivity

/// Ponte nativo di AuraLift: Apple Salute (scrittura allenamenti, calorie, peso) e Apple Watch
/// (stato dell'allenamento verso il Watch, azioni dal Watch verso l'app).
@objc(AuraNativePlugin)
public class AuraNativePlugin: CAPPlugin, CAPBridgedPlugin, WCSessionDelegate {
    public let identifier = "AuraNativePlugin"
    public let jsName = "AuraNative"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "healthAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "healthAuthorize", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "saveWorkout", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "saveBodyMass", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "updateWatch", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "watchStatus", returnType: CAPPluginReturnPromise)
    ]

    private let store = HKHealthStore()
    private var lastContext: [String: Any] = [:]

    public override func load() {
        if WCSession.isSupported() {
            WCSession.default.delegate = self
            WCSession.default.activate()
        }
    }

    // MARK: - Apple Salute

    private var shareTypes: Set<HKSampleType> {
        var types: Set<HKSampleType> = [HKObjectType.workoutType()]
        if let energy = HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned) { types.insert(energy) }
        if let mass = HKQuantityType.quantityType(forIdentifier: .bodyMass) { types.insert(mass) }
        return types
    }

    @objc func healthAvailable(_ call: CAPPluginCall) {
        call.resolve(["available": HKHealthStore.isHealthDataAvailable()])
    }

    @objc func healthAuthorize(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.resolve(["granted": false])
            return
        }
        store.requestAuthorization(toShare: shareTypes, read: nil) { success, _ in
            let status = self.store.authorizationStatus(for: HKObjectType.workoutType())
            call.resolve(["granted": success && status == .sharingAuthorized])
        }
    }

    @objc func saveWorkout(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable(),
              store.authorizationStatus(for: HKObjectType.workoutType()) == .sharingAuthorized else {
            call.resolve(["saved": false])
            return
        }
        guard let startMs = call.getDouble("start"), let endMs = call.getDouble("end"), endMs > startMs else {
            call.reject("start/end required")
            return
        }
        let start = Date(timeIntervalSince1970: startMs / 1000)
        let end = Date(timeIntervalSince1970: endMs / 1000)
        let kcal = call.getDouble("kcal") ?? 0

        let config = HKWorkoutConfiguration()
        config.activityType = (call.getBool("highIntensity") ?? false) ? .highIntensityIntervalTraining : .traditionalStrengthTraining
        config.locationType = .indoor
        let builder = HKWorkoutBuilder(healthStore: store, configuration: config, device: .local())

        builder.beginCollection(withStart: start) { ok, error in
            guard ok else {
                call.reject(error?.localizedDescription ?? "beginCollection failed")
                return
            }
            let finish = {
                builder.endCollection(withEnd: end) { _, error in
                    if let error = error {
                        call.reject(error.localizedDescription)
                        return
                    }
                    builder.finishWorkout { workout, error in
                        if let error = error {
                            call.reject(error.localizedDescription)
                        } else {
                            call.resolve(["saved": workout != nil])
                        }
                    }
                }
            }
            if kcal > 0, let energy = HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned),
               self.store.authorizationStatus(for: energy) == .sharingAuthorized {
                let sample = HKQuantitySample(type: energy,
                                              quantity: HKQuantity(unit: .kilocalorie(), doubleValue: kcal),
                                              start: start, end: end)
                builder.add([sample]) { _, _ in finish() }
            } else {
                finish()
            }
        }
    }

    @objc func saveBodyMass(_ call: CAPPluginCall) {
        guard let mass = HKQuantityType.quantityType(forIdentifier: .bodyMass),
              HKHealthStore.isHealthDataAvailable(),
              store.authorizationStatus(for: mass) == .sharingAuthorized,
              let kg = call.getDouble("kg"), kg > 0 else {
            call.resolve(["saved": false])
            return
        }
        let date = call.getDouble("date").map { Date(timeIntervalSince1970: $0 / 1000) } ?? Date()
        let sample = HKQuantitySample(type: mass, quantity: HKQuantity(unit: .gramUnit(with: .kilo), doubleValue: kg),
                                      start: date, end: date)
        store.save(sample) { ok, _ in call.resolve(["saved": ok]) }
    }

    // MARK: - Apple Watch

    private func plistContext(_ options: [AnyHashable: Any]?) -> [String: Any] {
        var ctx: [String: Any] = [:]
        for (key, value) in options ?? [:] {
            guard let key = key as? String else { continue }
            if value is NSNull { continue }
            if value is String || value is NSNumber { ctx[key] = value }
        }
        return ctx
    }

    private func push(_ ctx: [String: Any]) {
        let session = WCSession.default
        guard session.activationState == .activated, session.isPaired, session.isWatchAppInstalled else { return }
        try? session.updateApplicationContext(ctx)
        if session.isReachable {
            session.sendMessage(["state": ctx], replyHandler: nil, errorHandler: nil)
        }
    }

    @objc func updateWatch(_ call: CAPPluginCall) {
        guard WCSession.isSupported() else {
            call.resolve()
            return
        }
        let ctx = plistContext(call.options)
        lastContext = ctx
        DispatchQueue.main.async { self.push(ctx) }
        call.resolve()
    }

    @objc func watchStatus(_ call: CAPPluginCall) {
        guard WCSession.isSupported() else {
            call.resolve(["supported": false, "paired": false, "installed": false, "reachable": false])
            return
        }
        let session = WCSession.default
        call.resolve([
            "supported": true,
            "paired": session.isPaired,
            "installed": session.isWatchAppInstalled,
            "reachable": session.isReachable
        ])
    }

    // MARK: - WCSessionDelegate

    public func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        if activationState == .activated && !lastContext.isEmpty {
            DispatchQueue.main.async { self.push(self.lastContext) }
        }
    }

    public func sessionDidBecomeInactive(_ session: WCSession) {}

    public func sessionDidDeactivate(_ session: WCSession) {
        WCSession.default.activate()
    }

    private func forward(_ payload: [String: Any]) {
        guard let action = payload["action"] as? String else { return }
        DispatchQueue.main.async {
            self.notifyListeners("watchAction", data: ["action": action])
        }
    }

    public func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        forward(message)
    }

    public func session(_ session: WCSession, didReceiveMessage message: [String: Any], replyHandler: @escaping ([String: Any]) -> Void) {
        forward(message)
        replyHandler(["ok": true])
    }

    public func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
        forward(userInfo)
    }
}
