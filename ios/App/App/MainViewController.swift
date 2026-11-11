import UIKit
import Capacitor

/// Bridge di Capacitor con il plugin nativo di AuraLift (Apple Salute + Apple Watch).
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(AuraNativePlugin())
    }
}
