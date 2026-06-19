import { Bell, X, AlertTriangle, CheckCircle, Info, Trash2 } from 'lucide-react'
import { useState } from 'react'

function NotificationsDropdown({ notifications, onClose, onNotificationClick, onMarkAllRead, onDeleteNotification }) {
  const [localNotifications, setLocalNotifications] = useState(notifications)

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle style={{ color: 'var(--red-text)' }} className="w-5 h-5" />
      case 'warning':
        return <AlertTriangle style={{ color: 'var(--yellow-text)' }} className="w-5 h-5" />
      case 'success':
        return <CheckCircle style={{ color: 'var(--green-text)' }} className="w-5 h-5" />
      default:
        return <Info style={{ color: 'var(--blue-text)' }} className="w-5 h-5" />
    }
  }

  const getNotificationBg = (type) => {
    switch (type) {
      case 'critical':
        return { bg: 'var(--red-bg)', border: 'var(--red-border)' }
      case 'warning':
        return { bg: 'var(--yellow-bg)', border: 'var(--yellow-border)' }
      case 'success':
        return { bg: 'var(--green-bg)', border: 'var(--green-border)' }
      default:
        return { bg: 'var(--blue-bg)', border: 'var(--blue-border)' }
    }
  }

  const handleNotificationClick = (notification, index) => {
    if (onNotificationClick) {
      onNotificationClick(notification)
    }
    // Mark as read
    const updated = [...localNotifications]
    updated[index] = { ...updated[index], read: true }
    setLocalNotifications(updated)
  }

  const handleDeleteNotification = (e, index) => {
    e.stopPropagation()
    if (onDeleteNotification) {
      onDeleteNotification(index)
    }
    const updated = localNotifications.filter((_, i) => i !== index)
    setLocalNotifications(updated)
  }

  const handleMarkAllRead = () => {
    const updated = localNotifications.map(n => ({ ...n, read: true }))
    setLocalNotifications(updated)
    if (onMarkAllRead) {
      onMarkAllRead()
    }
  }

  const unreadCount = localNotifications.filter(n => !n.read).length

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }} className="absolute right-0 top-full mt-2 w-96 rounded-xl shadow-2xl z-50 animate-fade-in">
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-raised)' }} className="p-4 flex items-center justify-between rounded-t-xl">
        <div className="flex items-center gap-2">
          <Bell style={{ color: 'var(--text-2)' }} className="w-5 h-5" />
          <h3 style={{ color: 'var(--text-1)' }} className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span style={{ background: 'var(--danger)' }} className="px-2 py-0.5 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          style={{ color: 'var(--text-2)' }}
          className="hover:bg-[var(--hover-bg)] hover:text-[var(--text-1)] rounded-lg p-1 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {localNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell style={{ color: 'var(--text-3)' }} className="w-12 h-12 mx-auto mb-3" />
            <p style={{ color: 'var(--text-3)' }} className="text-sm">No new notifications</p>
          </div>
        ) : (
          <div style={{ borderColor: 'var(--border)' }} className="divide-y">
            {localNotifications.map((notification, index) => {
              const theme = getNotificationBg(notification.type)
              return (
              <div
                key={index}
                onClick={() => handleNotificationClick(notification, index)}
                style={{ background: theme.bg, borderLeft: `4px solid ${theme.border}` }}
                className={`p-4 hover:bg-[var(--hover-bg)] transition-colors cursor-pointer relative group ${notification.read ? 'opacity-75' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p style={{ color: 'var(--text-1)' }} className={`text-sm font-semibold mb-1 ${notification.read ? '' : 'font-bold'}`}>
                          {notification.title}
                        </p>
                        <p style={{ color: 'var(--text-2)' }} className="text-xs mb-2">
                          {notification.message}
                        </p>
                        <p style={{ color: 'var(--text-3)' }} className="text-xs">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div style={{ background: 'var(--blue-text)' }} className="w-2 h-2 rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteNotification(e, index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-600 flex-shrink-0"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
      
      {localNotifications.length > 0 && unreadCount > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-raised)' }} className="p-3 rounded-b-xl">
          <button 
            onClick={handleMarkAllRead}
            style={{ color: 'var(--blue-text)' }}
            className="w-full text-sm font-medium py-2 hover:bg-[var(--blue-bg)] rounded-lg transition-colors"
          >
            Mark all as read ({unreadCount})
          </button>
        </div>
      )}
    </div>
  )
}

export default NotificationsDropdown
