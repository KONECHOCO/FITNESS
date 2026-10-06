# AURA FIT PRO — Smart Hypertrophy & Analytics Web Application ⚡

**AURA FIT PRO** is a high-performance, professional multi-language web application designed for strength training, progressive overload, biomechanics analysis, macro tracking, and AI coaching.

![AURA FIT PRO](assets/images/hero.jpg)

---

## 🌟 Key Features

- **📊 3D Muscle Fatigue & Recovery Heatmap**: Dynamic 72-hour muscle stress visualization with real-time state calculation.
- **🏋️ Live Workout Session Logger**: Interactive rep and weight tracker with rest countdown timer and **Web Audio API** sound cues (zero audio asset latency).
- **🧮 1RM Massimale Calculator**: Instant 1RM theoretical max estimation utilizing Epley, Brzycki, and Lander formulas.
- **🥗 Macro & Nutrition Tracker**: Daily calorie and macronutrient logger with hydration counter and quick meal presets.
- **🤖 FIT-AI Coach Pro**: Virtual AI assistant providing personalized overload recommendations, rest advice, and pre/post-workout nutrition guidance.
- **🌐 6-Language Global Localization (i18n)**: Native support for:
  - 🇮🇹 Italian (`it`)
  - 🇬🇧 English (`en`)
  - 🇪🇸 Spanish (`es`)
  - 🇫🇷 French (`fr`)
  - 🇩🇪 German (`de`)
  - 🇵🇹 Portuguese (`pt`)
- **🎨 Premium Cyber Dark Aesthetic**: Deep OLED dark mode (`#0B0E14`), translucent glassmorphism, fluorescent lime accenting (`#CCFF00`), and smooth 60fps CSS animations.

---

## 🚀 Getting Started

No build process or heavy dependencies required. Simply serve the directory with any HTTP server or open `index.html` in your browser.

```bash
# Clone the repository
git clone https://github.com/KONECHOCO/FITNESS.git

# Navigate into the project folder
cd FITNESS

# Start a simple local server
python -m http.server 8080
```

Open `http://localhost:8080` in your web browser.

---

## 📁 Directory Structure

```
FITNESS/
├── index.html        # Main HTML5 application structure & modal components
├── style.css         # Cyber Dark design system, responsive layout & glassmorphic UI
├── app.js            # i18n dictionary, audio engine, state manager, & FIT-AI logic
├── README.md         # Documentation
└── assets/
    └── images/       # High-resolution exercise, hero & nutrition media assets
```

---

## 📄 License

MIT License. Designed & Developed by [KONECHOCO](https://github.com/KONECHOCO).
