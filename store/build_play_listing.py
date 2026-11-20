"""Scheda Google Play da quella App Store (fastlane/metadata) → store/play/<lingua Play>/{title,short,full}.txt.

Toglie le parti solo iOS (Apple Watch e Apple Salute, EULA Apple) e aggiunge la descrizione breve (max 80).
Uso: python store/build_play_listing.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "fastlane" / "metadata"
OUT = ROOT / "store" / "play"

# lingua App Store -> lingua Play Console
LOCALES = {"it": "it-IT", "en-US": "en-US", "en-GB": "en-GB", "es-ES": "es-ES", "es-MX": "es-419",
           "fr-FR": "fr-FR", "de-DE": "de-DE", "pt-BR": "pt-BR", "pt-PT": "pt-PT"}

SHORT = {
    "it": "Schede palestra e casa, registro serie, recupero muscolare, progressi e dieta",
    "en": "Gym & home workouts, set logger, muscle recovery, progress charts and macros",
    "es": "Rutinas de gimnasio y casa, registro de series, recuperación, progreso y dieta",
    "fr": "Programmes salle et maison, suivi des séries, récupération, progrès et macros",
    "de": "Trainingspläne für Gym & Zuhause, Satz-Log, Regeneration, Fortschritt, Makros",
    "pt": "Treinos de academia e casa, registro de séries, recuperação, progresso e dieta",
}


def clean(desc: str) -> str:
    # blocco "APPLE WATCH ..." fino alla riga vuota successiva
    desc = re.sub(r"\nAPPLE WATCH[^\n]*\n(?:•[^\n]*\n)+", "\n", desc)
    # riga con l'EULA Apple
    desc = re.sub(r"[^\n]*apple\.com/legal[^\n]*\n", "", desc)
    desc = desc.replace("su tutti i tuoi dispositivi", "sui tuoi dispositivi")
    return re.sub(r"\n{3,}", "\n\n", desc).strip() + "\n"


for src_loc, play_loc in LOCALES.items():
    d = SRC / src_loc
    title = (d / "name.txt").read_text(encoding="utf-8").strip()
    full = clean((d / "description.txt").read_text(encoding="utf-8"))
    short = SHORT[src_loc.split("-")[0]]
    assert len(title) <= 30 and len(short) <= 80 and len(full) <= 4000, (play_loc, len(title), len(short), len(full))
    assert "Apple" not in full and "Watch" not in full, play_loc
    o = OUT / play_loc
    o.mkdir(parents=True, exist_ok=True)
    (o / "title.txt").write_text(title, encoding="utf-8")
    (o / "short.txt").write_text(short, encoding="utf-8")
    (o / "full.txt").write_text(full, encoding="utf-8")
    print(f"{play_loc}: {len(title)}/{len(short)}/{len(full)}")
