import { RefreshCw, Copy, Check } from 'lucide-react'
import { useState } from 'react'

function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [webhookNotifications, setWebhookNotifications] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleRegenerateApiKey = () => {
    if (window.confirm('Are you sure you want to regenerate the API key? The current key will be invalidated.')) {
      // In a real app, this would call an API
      alert('API key regenerated successfully!')
    }
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('hmp_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-sm text-gray-600 mt-2">Configure your monitoring preferences</p>
      </div>

      {/* Alert Configuration */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-800 rounded"></div>
          Alert Configuration
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Email Notifications
              </h3>
              <p className="text-sm text-gray-600">
                Receive incident alerts and status updates via email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-blue-700"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                SMS Notifications
              </h3>
              <p className="text-sm text-gray-600">
                Receive critical alerts via SMS messages
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smsNotifications}
                onChange={(e) => setSmsNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-blue-700"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Webhook Notifications
              </h3>
              <p className="text-sm text-gray-600">
                Send incident notifications to configured webhook endpoints
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={webhookNotifications}
                onChange={(e) => setWebhookNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-blue-700"></div>
            </label>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-800 rounded"></div>
          API Configuration
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              API Key
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                readOnly
                value="hmp_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4"
                className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-600 font-mono text-sm"
              />
              <button
                onClick={handleCopyApiKey}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                title="Copy API Key"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleRegenerateApiKey}
                className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Server URL
            </label>
            <input
              type="text"
              readOnly
              value="wss://monitor.example.com:8443"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-600 font-mono text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
