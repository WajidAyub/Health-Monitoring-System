import { useState, useEffect, useCallback } from 'react'
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
import { useMonitor } from './hooks/useMonitor'

// Real publicly-accessible URLs for live monitoring
const INITIAL_SERVICES = [
  {
    id: 'srv_001',
    name: 'GitHub API',
    url: 'https://api.github.com',
    type: 'HTTPS',
    status: 'UP',
    uptime: 99.95,
    responseTime: 0,
    location: 'US-East',
    lastCheck: 'Pending…'
  },
  {
    id: 'srv_002',
    name: 'Cloudflare DNS',
    url: 'https://1.1.1.1',
    type: 'HTTPS',
    status: 'UP',
    uptime: 99.99,
    responseTime: 0,
    location: 'Global',
    lastCheck: 'Pending…'
  },
  {
    id: 'srv_003',
    name: 'JSONPlaceholder API',
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    type: 'HTTPS',
    status: 'UP',
    uptime: 99.80,
    responseTime: 0,
    location: 'EU-West',
    lastCheck: 'Pending…'
  },
  {
    id: 'srv_004',
    name: 'HTTPBin Test',
    url: 'https://httpbin.org/get',
    type: 'HTTPS',
    status: 'UP',
    uptime: 99.50,
    responseTime: 0,
    location: 'US-West',
    lastCheck: 'Pending…'
  }
]

const INITIAL_INCIDENTS = []

function AppInner() {
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(true)
  const [showSignup, setShowSignup] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS)
  const [showAddService, setShowAddService] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [toast, setToast] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [newService, setNewService] = useState({
    name: '', type: 'HTTP', url: '', checkInterval: 300, timeout: 10
  })

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  // Status-change handler for auto incident creation/resolution
  const handleStatusChange = useCallback(({ serviceId, serviceName, from, to }) => {
    if (to === 'DOWN') {
      const newIncident = {
        id: `inc_${Date.now()}`,
        serviceId,
        serviceName,
        severity: 'CRITICAL',
        status: 'ACTIVE',
        message: 'Service unreachable — connection timeout or network error',
        started: 'Just now',
        startedAt: Date.now(),
        duration: '0m'
      }
      setIncidents(prev => [newIncident, ...prev])
      showToast(`🚨 ${serviceName} is DOWN!`, 'error')
    } else if (to === 'UP' && from === 'DOWN') {
      setIncidents(prev =>
        prev.map(inc =>
          inc.serviceId === serviceId && inc.status === 'ACTIVE'
            ? { ...inc, status: 'RESOLVED' }
            : inc
        )
      )
      showToast(`✅ ${serviceName} is back UP`, 'success')
    }
  }, [showToast])

  const { liveServices, events, addAndMonitorService, checkNow, removeService } = useMonitor(
    INITIAL_SERVICES,
    handleStatusChange
  )

  // Restore session
  useEffect(() => {
    const saved = localStorage.getItem('healthMonitorUser')
    if (saved) {
      setUser(JSON.parse(saved))
      setShowLogin(false)
    }
  }, [])

  const handleAddService = () => {
    if (!newService.name.trim() || !newService.url.trim()) {
      showToast('Please fill in all required fields', 'error')
      return
    }
    const service = {
      id: `srv_${Date.now()}`,
      name: newService.name,
      url: newService.url,
      type: newService.type,
      status: 'UP',
      uptime: 100,
      responseTime: 0,
      location: 'Custom',
      lastCheck: 'Pending…'
    }
    addAndMonitorService(service)
    setShowAddService(false)
    setNewService({ name: '', type: 'HTTP', url: '', checkInterval: 300, timeout: 10 })
    showToast('Service added — first check in progress…')
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      showToast('Next auto-check will run in 30 s')
    }, 800)
  }

  const handleAcknowledgeIncident = (incidentId) => {
    setIncidents(prev =>
      prev.map(inc => inc.id === incidentId ? { ...inc, status: 'RESOLVED' } : inc)
    )
    showToast('Incident acknowledged')
  }

  const calculateStats = () => {
    const totalServices  = liveServices.length
    const servicesUp     = liveServices.filter(s => s.status === 'UP').length
    const servicesDown   = liveServices.filter(s => s.status === 'DOWN').length
    const avgUptime      = liveServices.reduce((sum, s) => sum + s.uptime, 0) / (totalServices || 1)
    const activeIncidents = incidents.filter(i => i.status === 'ACTIVE').length
    return { totalServices, servicesUp, servicesDown, avgUptime: avgUptime.toFixed(2), activeIncidents }
  }

  const stats = calculateStats()

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('healthMonitorUser', JSON.stringify(userData))
    setShowLogin(false)
    setShowSignup(false)
    showToast('Welcome back!')
  }

  const handleSignup = (userData) => {
    setUser(userData)
    localStorage.setItem('healthMonitorUser', JSON.stringify(userData))
    setShowLogin(false)
    setShowSignup(false)
    showToast('Account created successfully!')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('healthMonitorUser')
    setShowLogin(true)
    setShowSignup(false)
    setActiveTab('dashboard')
    showToast('Logged out successfully')
  }

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('healthMonitorUser', JSON.stringify(updatedUser))
    showToast('Profile updated successfully!')
  }

  if (!user) {
    return (
      <ThemeProvider>
        {showSignup ? (
          <Signup
            onSignup={handleSignup}
            onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true) }}
          />
        ) : (
          <Login
            onLogin={handleLogin}
            onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true) }}
          />
        )}
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }} className="flex flex-col">
        <Header
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onNavigate={setActiveTab}
          user={user}
          onLogout={handleLogout}
          incidents={incidents}
          services={liveServices}
        />
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <Dashboard
              services={liveServices}
              incidents={incidents}
              stats={stats}
              events={events}
              onAddService={() => setShowAddService(true)}
              onViewIncidentDetails={setSelectedIncident}
            />
          )}
          {activeTab === 'services' && (
            <Services
              services={liveServices}
              onAddService={() => setShowAddService(true)}
              onCheckNow={checkNow}
              onRemove={removeService}
            />
          )}
          {activeTab === 'incidents' && (
            <Incidents
              incidents={incidents}
              services={liveServices}
              onAcknowledge={handleAcknowledgeIncident}
              onViewDetails={setSelectedIncident}
            />
          )}
          {activeTab === 'reports'  && <Reports services={liveServices} incidents={incidents} />}
          {activeTab === 'settings' && <Settings />}
          {activeTab === 'profile'  && <Profile user={user} onUpdateUser={handleUpdateUser} />}
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
            service={liveServices.find(s => s.id === selectedIncident.serviceId)}
            onClose={() => setSelectedIncident(null)}
          />
        )}

        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    </ThemeProvider>
  )
}

export default AppInner
