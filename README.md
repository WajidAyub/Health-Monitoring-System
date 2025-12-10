# Health Monitoring System

A professional network health monitoring dashboard built with React and Tailwind CSS. This application allows users to monitor websites, APIs, servers, and databases in real-time using the Health Monitor Protocol (HMP v1.0).

## Features

- **Dashboard View**: Comprehensive overview with statistics cards, services table, and recent incidents
- **Services Management**: View and manage all monitored services in a card-based grid layout
- **Incidents Tracking**: Monitor and manage service incidents with severity levels
- **Reports & Analytics**: View performance metrics and uptime statistics
- **Settings Configuration**: Configure alerts and API settings
- **Add Service**: Modal dialog to add new services for monitoring

## Tech Stack

- React 18+ with Hooks
- Tailwind CSS for styling
- Lucide React icons
- Vite for build tooling
- Responsive design (mobile, tablet, desktop)

## Getting Started

### Prerequisites

- Node.js 16+ and npm (or yarn)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Sticky header with logo and notifications
│   ├── NavigationTabs.jsx  # Tab navigation component
│   ├── Footer.jsx          # Footer with links and version info
│   └── AddServiceModal.jsx # Modal for adding new services
├── views/
│   ├── Dashboard.jsx       # Main dashboard view
│   ├── Services.jsx        # Services management view
│   ├── Incidents.jsx       # Incidents tracking view
│   ├── Reports.jsx         # Reports and analytics view
│   └── Settings.jsx        # Settings configuration view
├── App.jsx                 # Main application component
├── main.jsx               # Application entry point
└── index.css              # Global styles with Tailwind
```

## Features Overview

### Dashboard
- 5 statistics cards showing key metrics
- Services table with uptime progress bars
- Recent incidents section with severity badges

### Services
- Grid layout of service cards
- Search and filter functionality (UI ready)
- Add new services via modal

### Incidents
- Full incident history
- Severity and status badges
- Acknowledge functionality for active incidents

### Reports
- Summary cards with key metrics
- Chart placeholder for future visualization
- Export report functionality (UI ready)

### Settings
- Alert configuration toggles
- API key management
- Server URL configuration

## Mock Data

The application includes mock data for:
- 4 sample services (Production API, Database, Web App, CDN)
- 2 sample incidents (Critical and Warning)

## Protocol

This application is based on the **Health Monitor Protocol (HMP v1.0)** for the Computer Networks course assignment.

## License

This project is created for educational purposes as part of the Computer Networks (Comp-352) course.

