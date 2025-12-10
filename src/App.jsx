import { useState, useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import Header from './components/Header'
import NavigationTabs from './components/NavigationTabs'
import Footer from './components/Footer'
import Dashboard from './views/Dashboard'
import Services from './views/Services'
import Incidents from './views/Incidents'
import Reports from './views/Reports'
import Settings from './views/Settings'
import Profile from './views/Profile'
import Login from './views/Login'
import Signup from './views/Signup'
import AddServiceModal from './components/AddServiceModal'
import IncidentDetailsModal from './components/IncidentDetailsModal'
import Toast from './components/Toast'

// Mock data
const initialServices = [
  {
    id: 'srv_001',
    name: 'Production API Server',
    url: 'https://api.example.com',
    type: 'HTTPS',
    status: 'UP',
    uptime: 99.95,
    responseTime: 245,
    location: 'US-East',
    lastCheck: '2 mins ago'
  },
  {
    id: 'srv_002',
    name: 'Database Primary',
    url: 'db.example.com:5432',
    type: 'TCP',
    status: 'UP',
    uptime: 99.99,
    responseTime: 12,
    location: 'US-East',
    lastCheck: '1 min ago'
  },
  {
    id: 'srv_003',
    name: 'Web Application',
    url: 'https://www.example.com',
    type: 'HTTP',
    status: 'DOWN',
    uptime: 98.50,
    responseTime: 0,
    location: 'EU-West',
    lastCheck: '5 mins ago'
  },
  {
    id: 'srv_004',
    name: 'CDN Server',
    url: 'https://cdn.example.com',
    type: 'HTTPS',
    status: 'UP',
    uptime: 99.92,
    responseTime: 89,
    location: 'US-West',
    lastCheck: '3 mins ago'
  }
]

const initialIncidents = [
  {
    id: 'inc_001',
    serviceId: 'srv_003',
    serviceName: 'Web Application',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    message: 'Connection timeout - Service unreachable',
    started: '15 mins ago',
    duration: '15m'
  },
  {
    id: 'inc_002',
    serviceId: 'srv_001',
    serviceName: 'Production API Server',
    severity: 'WARNING',
    status: 'RESOLVED',
    message: 'High response time detected',
    started: '2 hours ago',
    duration: '5m'
  }
]

function App() {
  // Authentication state
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(true)
  const [showSignup, setShowSignup] = useState(false)
  
  // App state
  const [activeTab, setActiveTab] = useState('dashboard')
  const [services, setServices] = useState(initialServices)
  const [incidents, setIncidents] = useState(initialIncidents)
  const [showAddService, setShowAddService] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [toast, setToast] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [newService, setNewService] = useState({
    name: '',
    type: 'HTTP',
    url: '',
    checkInterval: 300,
    timeout: 10
  })

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('healthMonitorUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setShowLogin(false)
    }
  }, [])

  const handleAddService = () => {
    if (!newService.name.trim() || !newService.url.trim()) {
      setToast({ message: 'Please fill in all required fields', type: 'error' })
      return
    }

    const service = {
      id: `srv_${String(services.length + 1).padStart(3, '0')}`,
      name: newService.name,
      url: newService.url,
      type: newService.type,
      status: 'UP',
      uptime: 100,
      responseTime: Math.floor(Math.random() * 500),
      location: 'US-East',
      lastCheck: 'Just now'
    }

    setServices([...services, service])
    setShowAddService(false)
    setNewService({
      name: '',
      type: 'HTTP',
      url: '',
      checkInterval: 300,
      timeout: 10
    })
    setToast({ message: 'Service added successfully!', type: 'success' })
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
      setToast({ message: 'Data refreshed successfully', type: 'success' })
    }, 1000)
  }

  const handleAcknowledgeIncident = (incidentId) => {
    setIncidents(incidents.map(inc => 
      inc.id === incidentId ? { ...inc, status: 'RESOLVED' } : inc
    ))
    setToast({ message: 'Incident acknowledged', type: 'success' })
  }

  const calculateStats = () => {
    const totalServices = services.length
    const servicesUp = services.filter(s => s.status === 'UP').length
    const servicesDown = services.filter(s => s.status === 'DOWN').length
    const avgUptime = services.reduce((sum, s) => sum + s.uptime, 0) / totalServices || 0
    const activeIncidents = incidents.filter(i => i.status === 'ACTIVE').length

    return {
      totalServices,
      servicesUp,
      servicesDown,
      avgUptime: avgUptime.toFixed(2),
      activeIncidents
    }
  }

  const stats = calculateStats()

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('healthMonitorUser', JSON.stringify(userData))
    setShowLogin(false)
    setShowSignup(false)
    setToast({ message: 'Welcome back!', type: 'success' })
  }

  const handleSignup = (userData) => {
    setUser(userData)
    localStorage.setItem('healthMonitorUser', JSON.stringify(userData))
    setShowLogin(false)
    setShowSignup(false)
    setToast({ message: 'Account created successfully!', type: 'success' })
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('healthMonitorUser')
    setShowLogin(true)
    setShowSignup(false)
    setActiveTab('dashboard')
    setToast({ message: 'Logged out successfully', type: 'success' })
  }

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('healthMonitorUser', JSON.stringify(updatedUser))
    setToast({ message: 'Profile updated successfully!', type: 'success' })
  }

  const handleNavigate = (tab) => {
    setActiveTab(tab)
  }

  // Show login/signup if not authenticated
  if (!user) {
    return (
      <ThemeProvider>
        {showSignup ? (
          <Signup
            onSignup={handleSignup}
            onSwitchToLogin={() => {
              setShowSignup(false)
              setShowLogin(true)
            }}
          />
        ) : (
          <Login
            onLogin={handleLogin}
            onSwitchToSignup={() => {
              setShowLogin(false)
              setShowSignup(true)
            }}
          />
        )}
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-200">
      <Header 
        onRefresh={handleRefresh} 
        isRefreshing={isRefreshing} 
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
        incidents={incidents}
        services={services}
      />
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1">
        {activeTab === 'dashboard' && (
          <Dashboard 
            services={services} 
            incidents={incidents} 
            stats={stats}
            onAddService={() => setShowAddService(true)}
            onViewIncidentDetails={(incident) => setSelectedIncident(incident)}
          />
        )}
        {activeTab === 'services' && (
          <Services 
            services={services}
            onAddService={() => setShowAddService(true)}
          />
        )}
        {activeTab === 'incidents' && (
          <Incidents 
            incidents={incidents}
            services={services}
            onAcknowledge={handleAcknowledgeIncident}
            onViewDetails={(incident) => setSelectedIncident(incident)}
          />
        )}
        {activeTab === 'reports' && (
          <Reports services={services} incidents={incidents} />
        )}
        {activeTab === 'settings' && <Settings />}
        {activeTab === 'profile' && (
          <Profile user={user} onUpdateUser={handleUpdateUser} />
        )}
      </main>

      <Footer />

      {showAddService && (
        <AddServiceModal
          newService={newService}
          setNewService={setNewService}
          onClose={() => setShowAddService(false)}
          onAdd={handleAddService}
        />
      )}

      {selectedIncident && (
        <IncidentDetailsModal
          incident={selectedIncident}
          service={services.find(s => s.id === selectedIncident.serviceId)}
          onClose={() => setSelectedIncident(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      </div>
    </ThemeProvider>
  )
}

export default App

