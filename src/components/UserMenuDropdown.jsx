import { User, Settings, LogOut, HelpCircle, ChevronRight } from 'lucide-react'

function UserMenuDropdown({ onClose, onNavigate, onLogout, user }) {
  const menuItems = [
    { icon: User, label: 'Profile', action: 'profile' },
    { icon: Settings, label: 'Settings', action: 'settings' },
    { icon: HelpCircle, label: 'Help & Support', action: 'help' },
    { icon: LogOut, label: 'Logout', action: 'logout', danger: true }
  ]

  const handleItemClick = (action) => {
    if (action === 'settings') {
      onNavigate('settings')
    } else if (action === 'profile') {
      onNavigate('profile')
    } else if (action === 'logout') {
      if (window.confirm('Are you sure you want to logout?')) {
        onLogout()
      }
    } else {
      alert(`${action} feature coming soon!`)
    }
    onClose()
  }

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }} className="absolute right-0 top-full mt-2 w-64 rounded-xl shadow-2xl z-50 animate-fade-in">
      <div style={{ borderBottom: '1px solid var(--border)' }} className="p-4">
        <div className="flex items-center gap-3">
          <div style={{ background: 'var(--blue-bg)', color: 'var(--blue-text)' }} className="w-10 h-10 rounded-full flex items-center justify-center font-semibold shadow-md">
            {user?.avatar || 'A'}
          </div>
          <div>
            <p style={{ color: 'var(--text-1)' }} className="text-sm font-semibold">{user?.name || 'User'}</p>
            <p style={{ color: 'var(--text-3)' }} className="text-xs">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>
      
      <div className="py-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <button
              key={index}
              onClick={() => handleItemClick(item.action)}
              style={{ color: item.danger ? 'var(--red-text)' : 'var(--text-2)' }}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                item.danger
                  ? 'hover:bg-[var(--red-bg)]'
                  : 'hover:bg-[var(--hover-bg)] hover:text-[var(--text-1)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight style={{ color: 'var(--text-3)' }} className="w-4 h-4" />
            </button>
          )
        })}
      </div>
      
      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-raised)' }} className="p-3 rounded-b-xl">
        <p style={{ color: 'var(--text-3)' }} className="text-xs text-center">
          Health Monitor v1.0
        </p>
      </div>
    </div>
  )
}

export default UserMenuDropdown

