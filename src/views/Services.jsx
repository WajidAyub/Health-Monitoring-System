import { useState } from 'react'
import { Plus, Search, Filter, CheckCircle, AlertTriangle, Clock, X } from 'lucide-react'

function Services({ services, onAddService }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [showFilter, setShowFilter] = useState(false)

  const getStatusIcon = (status) => {
    return status === 'UP' ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <AlertTriangle className="w-5 h-5 text-red-600" />
    )
  }

  const getUptimeColor = (uptime) => {
    if (uptime >= 99.5) return 'text-green-600'
    if (uptime >= 95) return 'text-yellow-600'
    return 'text-red-600'
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.url.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || service.type === filterType
    return matchesSearch && matchesFilter
  })

  const serviceTypes = ['all', 'HTTP', 'HTTPS', 'TCP', 'ICMP']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          All Services
        </h1>
        
        <div className="flex items-center gap-3">
          {showSearch ? (
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                autoFocus
              />
              <button
                onClick={() => {
                  setShowSearch(false)
                  setSearchQuery('')
                }}
                className="absolute right-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          )}
          
          {showFilter ? (
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8"
              >
                {serviceTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  setShowFilter(false)
                  setFilterType('all')
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowFilter(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          )}
          
          <button
            onClick={onAddService}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>
      </div>

      {/* Results count */}
      {(searchQuery || filterType !== 'all') && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredServices.length} of {services.length} services
        </div>
      )}

      {/* Service Cards Grid */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-gray-500 text-lg">No services found matching your criteria.</p>
        </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
          >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600 break-all">{service.url}</p>
                </div>
                <div className="ml-3">
                  {getStatusIcon(service.status)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 font-medium">Type</span>
                  <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                    {service.type}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 font-medium">Location</span>
                  <span className="text-sm font-semibold text-gray-900">{service.location}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 font-medium">Uptime</span>
                  <span className={`text-sm font-bold ${getUptimeColor(service.uptime)}`}>
                    {service.uptime}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 font-medium">Response Time</span>
                  <span className="text-sm font-semibold text-gray-900">{service.responseTime}ms</span>
                </div>
                
                <div className="flex items-center justify-between pt-3">
                  <span className="text-sm text-gray-600 font-medium">Last Check</span>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {service.lastCheck}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Services
