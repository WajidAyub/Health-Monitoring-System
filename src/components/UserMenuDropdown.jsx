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
    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 animate-fade-in">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
            {user?.avatar || 'A'}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
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
              className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                item.danger
                  ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>
          )
        })}
      </div>
      
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Health Monitor v1.0
        </p>
      </div>
    </div>
  )
}

export default UserMenuDropdown

