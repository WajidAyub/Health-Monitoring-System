import { useState, useRef, useEffect } from 'react'
import { Bell, RefreshCw, Activity, Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import NotificationsDropdown from './NotificationsDropdown'
import UserMenuDropdown from './UserMenuDropdown'

function Header({ onRefresh, isRefreshing, onNavigate, user, onLogout, incidents, services }) {
  const { isDark, toggleTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'Service Down',
      message: 'Web Application is currently down',
      time: '5 minutes ago',
      read: false,
      relatedId: 'inc_001',
      relatedType: 'incident'
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Response Time',
      message: 'Production API Server response time is above threshold',
      time: '15 minutes ago',
      read: false,
      relatedId: 'srv_001',
      relatedType: 'service'
    },
    {
      id: 3,
      type: 'success',
      title: 'Service Restored',
      message: 'Database Primary is back online',
      time: '1 hour ago',
      read: false,
      relatedId: 'srv_002',
      relatedType: 'service'
    }
  ])
  const notificationsRef = useRef(null)
  const userMenuRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleNotificationClick = (notification) => {
    if (notification.relatedType === 'incident') {
      onNavigate('incidents')
      setShowNotifications(false)
    } else if (notification.relatedType === 'service') {
      onNavigate('services')
      setShowNotifications(false)
    }
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleDeleteNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              Health Monitor
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Dark mode button clicked! Current theme:', isDark ? 'dark' : 'light')
                console.log('toggleTheme function:', toggleTheme)
                if (toggleTheme && typeof toggleTheme === 'function') {
                  toggleTheme()
                } else {
                  console.error('toggleTheme is not a function!', typeof toggleTheme)
                }
              }}
              className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 cursor-pointer active:scale-95 z-10 relative"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              type="button"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications)
                  setShowUserMenu(false)
                }}
                className="relative p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
                title="Notifications"
              >
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800 animate-pulse"></span>
                )}
              </button>
              {showNotifications && (
                <NotificationsDropdown
                  notifications={notifications}
                  onClose={() => setShowNotifications(false)}
                  onNotificationClick={handleNotificationClick}
                  onMarkAllRead={handleMarkAllRead}
                  onDeleteNotification={handleDeleteNotification}
                />
              )}
            </div>
            
            {/* Refresh */}
            <button 
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 ${
                isRefreshing ? 'cursor-not-allowed' : ''
              }`}
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : 'hover:rotate-180 transition-transform duration-500'}`} />
            </button>
            
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu)
                setShowNotifications(false)
              }}
              className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
              title="Account"
            >
              {user?.avatar || 'A'}
            </button>
              {showUserMenu && (
                <UserMenuDropdown
                  onClose={() => setShowUserMenu(false)}
                  onNavigate={onNavigate}
                  onLogout={onLogout}
                  user={user}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
