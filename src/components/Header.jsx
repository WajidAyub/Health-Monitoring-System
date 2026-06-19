import { useState, useRef, useEffect } from 'react'
import { Bell, RefreshCw, Activity, Moon, Sun, ChevronDown } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import NotificationsDropdown from './NotificationsDropdown'
import UserMenuDropdown from './UserMenuDropdown'

function Header({ onRefresh, isRefreshing, onNavigate, user, onLogout, incidents, services }) {
  const { isDark, toggleTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'critical', title: 'Service Down', message: 'Web Application is currently down', time: '5 minutes ago', read: false, relatedId: 'inc_001', relatedType: 'incident' },
    { id: 2, type: 'warning',  title: 'High Response Time', message: 'Production API Server response time above threshold', time: '15 minutes ago', read: false, relatedId: 'srv_001', relatedType: 'service' },
    { id: 3, type: 'success',  title: 'Service Restored', message: 'Database Primary is back online', time: '1 hour ago', read: false, relatedId: 'srv_002', relatedType: 'service' }
  ])
  const notificationsRef = useRef(null)
  const userMenuRef      = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) setShowNotifications(false)
      if (userMenuRef.current      && !userMenuRef.current.contains(e.target))      setShowUserMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length
  const downServices = (services || []).filter(s => s.status === 'DOWN').length
  const upServices   = (services || []).filter(s => s.status === 'UP').length
  const totalServices = (services || []).length

  return (
    <header style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
      className="sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
              className="p-1.5 rounded-lg">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <span style={{ color: 'var(--text-1)' }} className="text-sm font-bold tracking-tight">HealthMonitor</span>
              <span style={{ color: 'var(--text-3)' }} className="text-xs ml-1.5 hidden sm:inline">HMP v1.0</span>
            </div>
          </div>

          {/* System Status Pills */}
          <div className="hidden md:flex items-center gap-2">
            <div style={{ background: 'var(--green-bg)', border: `1px solid var(--green-border)`, color: 'var(--green-text)' }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {upServices} UP
            </div>
            {downServices > 0 && (
              <div style={{ background: 'var(--red-bg)', border: `1px solid var(--red-border)`, color: 'var(--red-text)' }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                {downServices} DOWN
              </div>
            )}
            <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
              className="px-3 py-1 rounded-full text-xs font-medium">
              {totalServices} Services
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <button onClick={toggleTheme} title={isDark ? 'Light mode' : 'Dark mode'}
              style={{ color: 'var(--text-2)' }}
              className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Refresh */}
            <button onClick={onRefresh} disabled={isRefreshing} title="Refresh"
              style={{ color: 'var(--text-2)' }}
              className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors disabled:opacity-40">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false) }}
                style={{ color: 'var(--text-2)' }}
                className="relative p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span style={{ background: 'var(--danger)' }}
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-[var(--bg-surface)]" />
                )}
              </button>
              {showNotifications && (
                <NotificationsDropdown
                  notifications={notifications}
                  onClose={() => setShowNotifications(false)}
                  onNotificationClick={(n) => { if (n.relatedType === 'incident') onNavigate('incidents'); else onNavigate('services'); setShowNotifications(false) }}
                  onMarkAllRead={() => setNotifications(p => p.map(n => ({ ...n, read: true })))}
                  onDeleteNotification={(i) => setNotifications(p => p.filter((_, idx) => idx !== i))}
                />
              )}
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 20, background: 'var(--border)' }} className="mx-1" />

            {/* User */}
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false) }}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-[var(--hover-bg)] transition-colors">
                <div style={{ background: 'var(--accent)', fontSize: 12 }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold">
                  {(user?.name?.[0] || user?.avatar || 'A').toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p style={{ color: 'var(--text-1)', fontSize: 12 }} className="font-medium leading-none">{user?.name || 'Admin'}</p>
                </div>
                <ChevronDown style={{ color: 'var(--text-3)' }} className="w-3 h-3" />
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
