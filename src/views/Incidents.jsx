import { AlertTriangle, Clock } from 'lucide-react'

function Incidents({ incidents, services, onAcknowledge, onViewDetails }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-600 text-white shadow-lg shadow-red-500/50'
      case 'WARNING':
        return 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50'
      case 'INFO':
        return 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getStatusBadgeColor = (status) => {
    return status === 'ACTIVE' 
      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
      : 'bg-green-100 text-green-800 border-green-300'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Incidents
        </h1>
        <p className="text-sm text-gray-600 mt-2">Monitor and manage service incidents</p>
      </div>

      {incidents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No incidents to display.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-4 py-2 text-xs font-bold rounded-lg ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className={`px-4 py-2 text-xs font-semibold rounded-lg border ${getStatusBadgeColor(incident.status)}`}>
                      {incident.status}
                    </span>
                    <span className="text-sm text-gray-500 font-mono">Incident #{incident.id}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {incident.serviceName}
                  </h3>
                  
                  <p className="text-base text-gray-700 mb-4 leading-relaxed">{incident.message}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      Started: <span className="font-semibold">{incident.started}</span>
                    </div>
                    <div>Duration: <span className="font-semibold">{incident.duration}</span></div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  {incident.status === 'ACTIVE' && (
                    <button
                      onClick={() => onAcknowledge(incident.id)}
                      className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button 
                    onClick={() => onViewDetails(incident)}
                    className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Incidents
