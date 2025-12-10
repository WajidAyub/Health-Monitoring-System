import { X, Clock, AlertTriangle, Server, Calendar, Activity } from 'lucide-react'

function IncidentDetailsModal({ incident, service, onClose }) {
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

  if (!incident) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Incident Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Severity and Status */}
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 text-sm font-bold rounded-lg ${getSeverityColor(incident.severity)}`}>
              {incident.severity}
            </span>
            <span className={`px-4 py-2 text-sm font-semibold rounded-lg border ${getStatusBadgeColor(incident.status)}`}>
              {incident.status}
            </span>
            <span className="text-sm text-gray-500 font-mono">#{incident.id}</span>
          </div>

          {/* Service Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Server className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{incident.serviceName}</h3>
                {service && (
                  <p className="text-sm text-gray-600">{service.url}</p>
                )}
              </div>
            </div>
            {service && (
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-200">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Type</p>
                  <p className="text-sm font-semibold text-gray-900">{service.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Location</p>
                  <p className="text-sm font-semibold text-gray-900">{service.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-900 mb-1">Error Message</h4>
                <p className="text-sm text-red-800 leading-relaxed">{incident.message}</p>
              </div>
            </div>
          </div>

          {/* Timeline Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <h4 className="text-sm font-semibold text-gray-700">Started</h4>
              </div>
              <p className="text-base font-bold text-gray-900">{incident.started}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-gray-600" />
                <h4 className="text-sm font-semibold text-gray-700">Duration</h4>
              </div>
              <p className="text-base font-bold text-gray-900">{incident.duration}</p>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Additional Information
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-semibold">Incident ID:</span> {incident.id}</p>
              <p><span className="font-semibold">Service ID:</span> {incident.serviceId}</p>
              <p><span className="font-semibold">Severity Level:</span> {incident.severity}</p>
              <p><span className="font-semibold">Current Status:</span> {incident.status}</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default IncidentDetailsModal

