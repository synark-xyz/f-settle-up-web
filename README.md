# SettleUp

**SettleUp** is a modern credit‑card and expense‑management web application built with React (Vite) and vanilla CSS. It showcases a premium dark‑theme UI with emerald green accents, animated card stacks, and AI‑powered OCR for scanning credit‑card statements.

---

## 📖 Overview

- **Purpose**: Help users track credit‑card balances, due dates, and expenses in a clean, visual dashboard.
- **Key Technologies**:
  - React + Vite
  - Framer Motion for smooth animations
  - Google Gemini (`gemini-2.5-flash`) for OCR of card images
  - Firebase Authentication & Hosting
  - Vanilla CSS with custom design tokens (dark mode, emerald palette)
- **Design Philosophy**: Premium, minimalist UI with glass‑morphism, micro‑animations, and responsive layouts that also work inside an iPad frame wrapper for tablet simulation.

---

## ✨ Features

- **Dashboard**
  - Dark‑mode dashboard with emerald accents.
  - Interactive 3‑D card stack that expands on hover/tap.
  - Expense breakdown pie chart.
- **Add Card Modal**
  - Scan a credit‑card using the camera.
  - AI‑powered OCR (`gemini-2.5‑flash`) extracts card number, expiry, and holder name.
  - Manual entry fallback with category & notes.
- **Card Details**
  - Swipeable bottom sheet showing full card info, notes, reminders, and delete action.
- **Profile & Settings**
  - User profile page with avatar and email.
  - Settings page with theme toggle, notification preferences, and back navigation.
- **Dev Mode**
  - Auto‑login as a dummy user **John Doe** on localhost.
  - Mock data is only provided for this dummy user, keeping real users clean.
- **iPad Frame Wrapper**
  - Simulates an iPad on desktop for a realistic tablet experience.

---

## 🏗️ Architecture

```text
src/
├─ components/          # UI components (Dashboard, CardStack, ExpensesChart, etc.)
├─ contexts/            # AuthContext, ThemeContext
├─ lib/                 # Gemini API wrapper, utils, card utilities
├─ pages/ (optional)    # If you add routing later
├─ App.jsx              # Root component with routing & layout
└─ index.css            # Global CSS variables and dark‑theme tokens
```

All styling lives in `src/index.css` using CSS variables such as `--color-dark-bg`, `--color-brand-primary`, etc. The design system is deliberately vanilla to keep the bundle small and fully customizable.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later) and **npm**
- A **Google Gemini API key** (required for OCR)
- **Firebase CLI** (`npm i -g firebase-tools`) if you plan to deploy

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/SettleUp.git
cd SettleUp

# Install dependencies
npm install
```

### Configure Environment

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note**: Do not commit this file. It is listed in `.gitignore`.

### Run Locally

```bash
npm run dev
```

Open `http://localhost:5173` in your browser. In development mode the app will automatically sign‑in as **John Doe** and load mock credit‑card data.

### Build for Production

```bash
npm run build
```

The compiled assets are placed in the `dist/` folder.

### Deploy to Firebase Hosting

```bash
firebase login
firebase deploy
```

Your live site will be available at the URL shown after deployment (e.g., `https://settleup‑ae83a.web.app`).

---

## 📚 How to Use

1. **Explore the Dashboard** – view your cards, balances, and upcoming due dates.
2. **Add a New Card** – click the **Add Card** button, scan a card or fill the form manually.
3. **View Card Details** – tap a card to open the bottom sheet with full info.
4. **Adjust Settings** – toggle dark/light mode, change notification preferences, or log out.
5. **Dev Mode** – when running locally you’re automatically logged in as **John Doe**; real authentication works on production.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo, create a feature branch, and submit a pull request. Follow the existing code style and run `npm run lint` before submitting.

---

## 📄 License

This project is licensed under the MIT License.
