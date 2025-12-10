import { Bell, X, AlertTriangle, CheckCircle, Info, Trash2 } from 'lucide-react'
import { useState } from 'react'

function NotificationsDropdown({ notifications, onClose, onNotificationClick, onMarkAllRead, onDeleteNotification }) {
  const [localNotifications, setLocalNotifications] = useState(notifications)

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getNotificationBg = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'success':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-blue-50 border-blue-200'
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
    <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 animate-fade-in">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-700" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-1 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {localNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No new notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {localNotifications.map((notification, index) => (
              <div
                key={index}
                onClick={() => handleNotificationClick(notification, index)}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border-l-4 relative group ${
                  getNotificationBg(notification.type)
                } ${notification.read ? 'opacity-75' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className={`text-sm font-semibold text-gray-900 dark:text-white mb-1 ${notification.read ? '' : 'font-bold'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
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
            ))}
          </div>
        )}
      </div>
      
      {localNotifications.length > 0 && unreadCount > 0 && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <button 
            onClick={handleMarkAllRead}
            className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium py-2 hover:bg-blue-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Mark all as read ({unreadCount})
          </button>
        </div>
      )}
    </div>
  )
}

export default NotificationsDropdown
