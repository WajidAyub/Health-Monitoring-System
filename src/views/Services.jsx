import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Loader2, RefreshCw, Trash2, ShieldCheck, Activity } from 'lucide-react'
import Sparkline from '../components/Sparkline'

function relativeTime(ts) {
  if (!ts) return 'Pending…'
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 5)  return 'Just now'
  if (s < 60) return `${s}s ago`
  return `${Math.floor(s / 60)}m ago`
}

function countdown(nextCheckAt) {
  if (!nextCheckAt) return '—'
  const s = Math.max(0, Math.ceil((nextCheckAt - Date.now()) / 1000))
  if (s === 0) return 'Now…'
  return `${s}s`
}

const FIELD_STYLE = {
  background: 'var(--bg-raised)', border: '1px solid var(--border)',
  borderRadius: 8, color: 'var(--text-1)', fontSize: 13, padding: '8px 12px',
  outline: 'none', fontFamily: 'Inter, sans-serif'
}

function Services({ services, onAddService, onCheckNow, onRemove }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType]   = useState('all')
  const [showSearch,  setShowSearch]  = useState(false)
  const [showFilter,  setShowFilter]  = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const filteredServices = services.filter(s => {
    const q = searchQuery.toLowerCase()
    return (s.name.toLowerCase().includes(q) || s.url.toLowerCase().includes(q)) &&
           (filterType === 'all' || s.type === filterType)
  })

  const serviceTypes = ['all', 'HTTP', 'HTTPS', 'TCP', 'ICMP']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 style={{ color: 'var(--text-1)', fontSize: 22, fontWeight: 700, margin: 0 }}>All Services</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, margin: '4px 0 0' }}>Manage and monitor your endpoints</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {showSearch ? (
            <div className="relative flex items-center">
              <Search style={{ color: 'var(--text-3)' }} className="absolute left-3 w-4 h-4" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search services…" autoFocus
                style={{ ...FIELD_STYLE, paddingLeft: 36, width: 220 }}
                onBlur={() => !searchQuery && setShowSearch(false)}
              />
            </div>
          ) : (
            <button onClick={() => setShowSearch(true)}
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
              className="hover:border-[var(--border-hover)] hover:text-[var(--text-1)] transition-colors">
              <Search className="w-4 h-4" />Search
            </button>
          )}

          {showFilter ? (
            <div className="relative">
              <select value={filterType} onChange={e => setFilterType(e.target.value)}
                style={{ ...FIELD_STYLE, paddingRight: 32, appearance: 'none' }}
                onBlur={() => filterType === 'all' && setShowFilter(false)}>
                {serviceTypes.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
              </select>
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <Filter style={{ color: 'var(--text-3)' }} className="w-3.5 h-3.5" />
              </div>
            </div>
          ) : (
            <button onClick={() => setShowFilter(true)}
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
              className="hover:border-[var(--border-hover)] hover:text-[var(--text-1)] transition-colors">
              <Filter className="w-4 h-4" />Filter
            </button>
          )}

          <button onClick={onAddService}
            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            className="hover:bg-blue-500 transition-colors">
            <Plus className="w-4 h-4" />Add Service
          </button>
        </div>
      </div>

      {(searchQuery || filterType !== 'all') && (
        <div style={{ color: 'var(--text-2)', fontSize: 13, marginBottom: 16 }}>
          Showing {filteredServices.length} of {services.length} services
        </div>
      )}

      {filteredServices.length === 0 ? (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '60px 20px', textAlign: 'center' }}>
          <Activity style={{ color: 'var(--text-3)', margin: '0 auto 12px' }} className="w-12 h-12" />
          <p style={{ color: 'var(--text-1)', fontSize: 15, fontWeight: 500, margin: 0 }}>No services found</p>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4 }}>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredServices.map(service => {
            const isDown = service.status === 'DOWN'
            return (
              <div key={service.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${isDown ? 'var(--danger)' : 'var(--border)'}`,
                  borderRadius: 12, padding: 20,
                  transition: 'border-color 0.2s',
                  position: 'relative', overflow: 'hidden'
                }}
                className="hover:border-[var(--border-hover)]">
                
                {/* Top highlight bar */}
                {isDown && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--danger)' }} />}
                {!isDown && service.status === 'UP' && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--success)' }} />}

                {/* Card Header */}
                <div className="flex items-start justify-between mb-4 mt-1">
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 style={{ color: 'var(--text-1)', fontSize: 16, fontWeight: 600, margin: '0 0 4px' }} className="truncate">{service.name}</h3>
                    <p style={{ color: 'var(--text-2)', fontSize: 12, margin: 0, fontFamily: 'JetBrains Mono, monospace' }} className="truncate">{service.url}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {service.isChecking ? (
                      <span style={{ background: 'var(--blue-bg)', color: 'var(--blue-text)', border: '1px solid var(--blue-border)', padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Loader2 className="w-3 h-3 animate-spin" /> CHECKING
                      </span>
                    ) : (
                      <span style={{
                        background: service.status === 'UP' ? 'var(--green-bg)' : 'var(--red-bg)',
                        color: service.status === 'UP' ? 'var(--green-text)' : 'var(--red-text)',
                        border: `1px solid ${service.status === 'UP' ? 'var(--green-border)' : 'var(--red-border)'}`,
                        padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 4
                      }}>
                        <span className={`status-dot ${service.status === 'UP' ? 'up' : 'down'}`} style={{ width: 6, height: 6 }} />
                        {service.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Sparkline */}
                <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', marginBottom: 16 }}>
                  <p style={{ color: 'var(--text-3)', fontSize: 11, margin: '0 0 6px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Response Trend</span>
                    <span>{service.history?.length || 0} pts</span>
                  </p>
                  <Sparkline data={service.history || []} status={service.status} width={320} height={40} />
                </div>

                {/* Stats Table */}
                <div className="space-y-2 mb-5">
                  {[
                    { label: 'Type',          value: <span style={{ background: 'var(--bg-surface)', color: 'var(--text-2)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>{service.type}</span> },
                    { label: 'Real Uptime',   value: <span style={{ color: service.uptime >= 99 ? 'var(--success)' : service.uptime >= 95 ? 'var(--warning)' : 'var(--danger)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600 }}>{service.checkCount ? `${service.uptime}%` : '—'}</span> },
                    { label: 'Response Time', value: <span style={{ color: 'var(--text-1)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{service.status === 'UP' ? `${service.responseTime} ms` : '—'}</span> },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-2)', fontSize: 12 }}>{row.label}</span>
                      {row.value}
                    </div>
                  ))}
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 2 }}>
                    <span style={{ color: 'var(--text-2)', fontSize: 12 }}>Next Check</span>
                    <span style={{ color: (service.nextCheckAt && (service.nextCheckAt - Date.now()) < 6000) ? 'var(--warning)' : 'var(--text-2)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }} className={(service.nextCheckAt && (service.nextCheckAt - Date.now()) < 6000) ? 'animate-pulse' : ''}>
                      {countdown(service.nextCheckAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button onClick={() => onCheckNow?.(service.id)} disabled={service.isChecking}
                    style={{ flex: 1, background: 'var(--blue-bg)', color: 'var(--blue-text)', border: '1px solid var(--blue-border)', borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: service.isChecking ? 'not-allowed' : 'pointer', opacity: service.isChecking ? 0.6 : 1 }}
                    className="hover:bg-[rgba(59,130,246,0.15)] transition-colors">
                    <RefreshCw className={`w-3.5 h-3.5 ${service.isChecking ? 'animate-spin' : ''}`} />
                    Check Now
                  </button>

                  {confirmDelete === service.id ? (
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => { onRemove?.(service.id); setConfirmDelete(null) }}
                        style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Yes
                      </button>
                      <button onClick={() => setConfirmDelete(null)}
                        style={{ background: 'var(--bg-raised)', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                        No
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(service.id)}
                      style={{ background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      className="hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 transition-colors" title="Delete Service">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Services
