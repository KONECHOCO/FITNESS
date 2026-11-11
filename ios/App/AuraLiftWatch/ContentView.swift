import SwiftUI
import WatchKit

/// Testi del Watch nelle 6 lingue dell'app.
enum L10n {
    private static let lang: String = {
        let code = String((Locale.preferredLanguages.first ?? "en").prefix(2))
        return ["it", "en", "es", "fr", "de", "pt"].contains(code) ? code : "en"
    }()

    private static let table: [String: [String: String]] = [
        "idleTitle": ["it": "Nessun allenamento", "en": "No workout", "es": "Sin entreno", "fr": "Aucune séance", "de": "Kein Workout", "pt": "Nenhum treino"],
        "idleText": ["it": "Inizia un allenamento in AuraLift su iPhone: lo vedrai qui.", "en": "Start a workout in AuraLift on iPhone to see it here.",
                     "es": "Empieza un entreno en AuraLift en el iPhone para verlo aquí.", "fr": "Lancez une séance dans AuraLift sur iPhone pour la voir ici.",
                     "de": "Starte ein Workout in AuraLift auf dem iPhone, um es hier zu sehen.", "pt": "Inicie um treino no AuraLift no iPhone para vê-lo aqui."],
        "set": ["it": "Serie", "en": "Set", "es": "Serie", "fr": "Série", "de": "Satz", "pt": "Série"],
        "done": ["it": "Serie fatta", "en": "Set done", "es": "Serie hecha", "fr": "Série faite", "de": "Satz fertig", "pt": "Série feita"],
        "rest": ["it": "Recupero", "en": "Rest", "es": "Descanso", "fr": "Repos", "de": "Pause", "pt": "Descanso"],
        "skip": ["it": "Salta", "en": "Skip", "es": "Saltar", "fr": "Passer", "de": "Überspringen", "pt": "Pular"],
        "allDone": ["it": "Tutte le serie completate. Termina l'allenamento su iPhone.", "en": "All sets done. Finish the workout on iPhone.",
                    "es": "Todas las series hechas. Termina el entreno en el iPhone.", "fr": "Toutes les séries sont faites. Terminez la séance sur iPhone.",
                    "de": "Alle Sätze erledigt. Beende das Workout auf dem iPhone.", "pt": "Todas as séries feitas. Finalize o treino no iPhone."]
    ]

    static func t(_ key: String) -> String {
        table[key]?[lang] ?? table[key]?["en"] ?? key
    }
}

private let accent = Color(red: 198 / 255, green: 242 / 255, blue: 78 / 255)

struct ContentView: View {
    @ObservedObject var session = WatchSession.shared
    @State private var restWasRunning = false

    var body: some View {
        if !session.active {
            idle
        } else if session.finished {
            VStack(spacing: 8) {
                Image(systemName: "checkmark.circle.fill").font(.system(size: 40)).foregroundColor(accent)
                Text(L10n.t("allDone")).font(.footnote).multilineTextAlignment(.center)
            }
        } else {
            TimelineView(.periodic(from: Date(), by: 1)) { context in
                if let end = session.restEnd, end > context.date {
                    rest(remaining: Int(end.timeIntervalSince(context.date).rounded(.up)))
                        .onAppear { restWasRunning = true }
                } else {
                    currentSet
                        .onAppear {
                            if restWasRunning {
                                restWasRunning = false
                                WKInterfaceDevice.current().play(.notification)
                            }
                        }
                }
            }
        }
    }

    private var idle: some View {
        VStack(spacing: 8) {
            Image(systemName: "bolt.fill").font(.system(size: 32)).foregroundColor(accent)
            Text(L10n.t("idleTitle")).font(.headline)
            Text(L10n.t("idleText")).font(.footnote).foregroundColor(.secondary).multilineTextAlignment(.center)
        }
        .padding(.horizontal, 4)
    }

    private var currentSet: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 6) {
                Text(session.workoutName).font(.caption2).foregroundColor(.secondary).lineLimit(1)
                Text(session.exerciseName).font(.headline).lineLimit(2)
                Text("\(L10n.t("set")) \(session.setIndex) / \(session.setCount)")
                    .font(.footnote).foregroundColor(accent)
                Text(session.timed ? "\(session.reps) s" : (session.weight.isEmpty ? "× \(session.reps)" : "\(session.weight) × \(session.reps)"))
                    .font(.system(size: 30, weight: .bold, design: .rounded))
                    .minimumScaleFactor(0.6)
                Button {
                    session.send("setDone")
                } label: {
                    Label(L10n.t("done"), systemImage: "checkmark")
                        .frame(maxWidth: .infinity)
                }
                .tint(accent)
                .foregroundColor(.black)
                .buttonStyle(.borderedProminent)
            }
        }
    }

    private func rest(remaining: Int) -> some View {
        VStack(spacing: 6) {
            Text(L10n.t("rest")).font(.footnote).foregroundColor(.secondary)
            Text(String(format: "%d:%02d", remaining / 60, remaining % 60))
                .font(.system(size: 44, weight: .bold, design: .rounded))
                .monospacedDigit()
                .foregroundColor(accent)
            Text("\(session.exerciseName) · \(L10n.t("set")) \(session.setIndex)/\(session.setCount)")
                .font(.caption2).foregroundColor(.secondary).lineLimit(1)
            HStack {
                Button("+15") { session.send("rest+15") }
                Button(L10n.t("skip")) { session.send("restSkip") }
                    .tint(accent)
            }
        }
    }
}
