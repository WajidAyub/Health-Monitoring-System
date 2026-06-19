import { Activity, Server, AlertTriangle, BarChart3, Settings, User } from 'lucide-react'

function NavigationTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'services',  label: 'Services',  icon: Server },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'reports',   label: 'Reports',   icon: BarChart3 },
    { id: 'profile',   label: 'Profile',   icon: User },
    { id: 'settings',  label: 'Settings',  icon: Settings },
  ]

  return (
    <nav style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
      className="sticky top-14 z-40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap transition-all duration-150 rounded-none outline-none"
                style={{
                  color: isActive ? 'var(--text-1)' : 'var(--text-2)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {isActive && (
                  <span style={{ background: 'linear-gradient(90deg, transparent, var(--accent-glow), transparent)' }}
                    className="absolute inset-0 rounded-none" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default NavigationTabs
