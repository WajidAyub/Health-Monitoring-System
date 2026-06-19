# Health Monitoring System (HMP v1.0)

<div align="center">
  <img src="https://img.shields.io/badge/React-18+-blue.svg?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-5.0+-646CFF.svg?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Theme-Light_|_Dark-000000.svg" alt="Theme Support" />
</div>

<br />

A professional, enterprise-grade network health monitoring dashboard built with React and Tailwind CSS. Designed with a premium **Linear/Vercel-inspired aesthetic**, this application allows operations teams to monitor websites, APIs, servers, and databases in real-time. 

It features a comprehensive semantic design token system, offering a flawless experience across both **Light and Dark modes**, with interactive visualizations and live service polling.

---

## ✨ Features

- **Enterprise-Grade UI**: Polished, modern interface with glassmorphism effects, subtle micro-animations, and high-fidelity contrast.
- **Seamless Theme Switching**: Fully tokenized CSS variable architecture supporting instantaneous toggling between precise Light and Dark modes.
- **Real-Time Dashboard**: Comprehensive overview with live statistics cards, a sparkline-based services table, and recent incident alerts.
- **Live Service Polling**: Automatic simulated `fetch()` requests checking service health every 30s with dynamic UI updates.
- **Service Management**: View, filter, and manage all monitored services in a responsive card-based grid layout.
- **Incident Tracking**: Detailed tracking of service incidents including severity badges, timelines, and resolution status.
- **Performance Analytics**: View uptime statistics and response time charts in the dedicated Reports section.
- **Secure Configuration**: Settings panel for API key management, alert preferences, and notification routing.

## 🚀 Tech Stack

- **Frontend Framework**: React 18+ (Hooks, Context API)
- **Styling**: Tailwind CSS combined with Vanilla CSS variables for semantic design tokens
- **Icons**: Lucide React
- **Build Tooling**: Vite for lightning-fast HMR and optimized production builds
- **Responsive Design**: Mobile, tablet, and desktop ready

## 🛠️ Getting Started

### Prerequisites

- Node.js 16+ and npm (or yarn/pnpm)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **View the application:**
   Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```
The optimized production build will be generated in the `dist` directory, ready for deployment.

## 📁 Project Structure

```text
src/
├── components/          # Reusable UI components (Modals, Dropdowns, Sparklines)
├── contexts/            # React Context providers (ThemeContext)
├── hooks/               # Custom React hooks (useMonitor)
├── views/               # Main application pages (Dashboard, Services, Reports, etc.)
├── App.jsx              # Main application router and layout
├── main.jsx             # Application entry point
└── index.css            # Global CSS variables, design tokens, and Tailwind directives
```

## 🎨 Theming & Design System

The application utilizes a custom semantic CSS variable system mapped to Tailwind utility classes. This prevents "design drift" and ensures that any newly added component automatically supports both Light and Dark modes.

To modify the theme, edit the tokens in `src/index.css`:
- `--bg-surface`: Main application background
- `--bg-raised`: Card and elevated element backgrounds
- `--text-1`, `--text-2`, `--text-3`: Typography hierarchy
- `--accent`, `--success`, `--danger`, `--warning`: Status colors

## 📄 License

This project was originally created for educational purposes as part of the Computer Networks (Comp-352) course (HMP v1.0).
