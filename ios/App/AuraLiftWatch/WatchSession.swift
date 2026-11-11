import Foundation
import WatchConnectivity
import WatchKit

/// Stato dell'allenamento ricevuto dall'iPhone (applicationContext / messaggi) e invio delle azioni dal polso.
final class WatchSession: NSObject, ObservableObject, WCSessionDelegate {
    static let shared = WatchSession()

    @Published var active = false
    @Published var workoutName = ""
    @Published var exerciseName = ""
    @Published var exerciseIndex = 0
    @Published var exerciseCount = 0
    @Published var setIndex = 0
    @Published var setCount = 0
    @Published var weight = ""
    @Published var reps = 0
    @Published var timed = false
    @Published var restEnd: Date?
    @Published var finished = false

    private override init() {
        super.init()
        if WCSession.isSupported() {
            WCSession.default.delegate = self
            WCSession.default.activate()
        }
    }

    private func apply(_ ctx: [String: Any]) {
        DispatchQueue.main.async {
            self.active = (ctx["active"] as? Bool) ?? false
            self.workoutName = (ctx["workout"] as? String) ?? ""
            self.exerciseName = (ctx["exercise"] as? String) ?? ""
            self.exerciseIndex = (ctx["exIndex"] as? Int) ?? 0
            self.exerciseCount = (ctx["exCount"] as? Int) ?? 0
            self.setIndex = (ctx["setIndex"] as? Int) ?? 0
            self.setCount = (ctx["setCount"] as? Int) ?? 0
            self.weight = (ctx["weight"] as? String) ?? ""
            self.reps = (ctx["reps"] as? Int) ?? 0
            self.timed = (ctx["timed"] as? Bool) ?? false
            self.finished = (ctx["allDone"] as? Bool) ?? false
            if let end = ctx["restEnd"] as? Double, end > 0 {
                self.restEnd = Date(timeIntervalSince1970: end / 1000)
            } else {
                self.restEnd = nil
            }
        }
    }

    func send(_ action: String) {
        let session = WCSession.default
        guard session.activationState == .activated else { return }
        let payload = ["action": action]
        if session.isReachable {
            session.sendMessage(payload, replyHandler: nil) { _ in
                session.transferUserInfo(payload)
            }
        } else {
            session.transferUserInfo(payload)
        }
        WKInterfaceDevice.current().play(.click)
    }

    // MARK: - WCSessionDelegate

    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        if activationState == .activated {
            apply(session.receivedApplicationContext)
        }
    }

    func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) {
        apply(applicationContext)
    }

    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        if let state = message["state"] as? [String: Any] {
            apply(state)
        }
    }
}
