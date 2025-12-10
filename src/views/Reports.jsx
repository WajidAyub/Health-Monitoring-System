import { BarChart3, Download, TrendingUp, Clock, AlertTriangle } from 'lucide-react'

function Reports({ services, incidents }) {
  const calculateUptime = () => {
    if (services.length === 0) return '0.00'
    const avg = services.reduce((sum, s) => sum + s.uptime, 0) / services.length
    return avg.toFixed(2)
  }

  const calculateAvgResponseTime = () => {
    if (services.length === 0) return 0
    const avg = services.reduce((sum, s) => sum + s.responseTime, 0) / services.length
    return Math.round(avg)
  }

  const totalIncidents = incidents.length

  const handleExport = () => {
    // Simulate export
    const data = {
      uptime: calculateUptime(),
      avgResponseTime: calculateAvgResponseTime(),
      totalIncidents,
      services: services.length,
      generatedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `health-monitor-report-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Reports
          </h1>
          <p className="text-sm text-gray-600 mt-2">Analytics and performance metrics</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Uptime Report</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">{calculateUptime()}%</p>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last 30 days
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Avg Response Time</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">{calculateAvgResponseTime()}ms</p>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last 30 days
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Total Incidents</h3>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">{totalIncidents}</p>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last 30 days
          </p>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-lg p-8 overflow-hidden">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-16 flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-300">
          <div className="p-4 bg-white rounded-full shadow-lg mb-4">
            <BarChart3 className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-xl text-gray-600 font-semibold mb-2">
            Chart visualization would appear here
          </p>
          <p className="text-sm text-gray-500 text-center max-w-md">
            Performance metrics and trends over time would be displayed in this area
          </p>
        </div>
      </div>
    </div>
  )
}

export default Reports
