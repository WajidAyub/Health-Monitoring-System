import { useState, useEffect } from 'react'
import { Server, CheckCircle, AlertTriangle, Bell, TrendingUp, Plus, Clock, Loader2, ShieldCheck } from 'lucide-react'
import Sparkline  from '../components/Sparkline'
import LiveStats  from '../components/LiveStats'
import LiveFeed   from '../components/LiveFeed'

function relativeTime(ts) {
  if (!ts) return '—'
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 5)  return 'Just now'
  if (s < 60) return `${s}s ago`
  return `${Math.floor(s / 60)}m ago`
}

const STAT_CARDS = [
  { key: 'totalServices',   label: 'Total Services',   icon: Server,      accent: '#3b82f6' },
  { key: 'servicesUp',      label: 'Services Up',      icon: CheckCircle, accent: '#10b981' },
  { key: 'servicesDown',    label: 'Services Down',    icon: AlertTriangle, accent: '#ef4444' },
  { key: 'activeIncidents', label: 'Active Incidents', icon: Bell,        accent: '#f59e0b' },
  { key: 'avgUptime',       label: 'Avg Uptime',       icon: TrendingUp,  accent: '#a78bfa', suffix: '%' },
]

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12 }}
      className="p-5 transition-all duration-200 hover:border-[rgba(148,163,184,0.2)] group">
      <div className="flex items-start justify-between">
        <div>
          <p style={{ color: 'var(--text-3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }} className="mb-2">{label}</p>
          <p style={{ color: 'var(--text-1)', fontSize: 28, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{value}</p>
        </div>
        <div style={{ background: `${accent}18`, borderRadius: 8, padding: 8 }} className="group-hover:scale-110 transition-transform">
          <Icon style={{ color: accent }} className="w-5 h-5" />
        </div>
      </div>
      <div style={{ marginTop: 12, height: 2, background: 'var(--border)', borderRadius: 1 }}>
        <div style={{ height: '100%', width: '100%', background: `linear-gradient(90deg, ${accent}60, ${accent}20)`, borderRadius: 1 }} />
      </div>
    </div>
  )
}

function StatusBadge({ service }) {
  if (service.isChecking) return (
    <div className="flex items-center gap-1.5">
      <Loader2 style={{ color: 'var(--blue-text)' }} className="w-3.5 h-3.5 animate-spin" />
      <span style={{ color: 'var(--blue-text)', fontSize: 11, fontWeight: 600 }}>CHECKING</span>
    </div>
  )
  return (
    <div className="flex items-center gap-1.5">
      <span className={`status-dot ${service.status === 'UP' ? 'up' : 'down'}`} />
      <span style={{ color: service.status === 'UP' ? 'var(--green-text)' : 'var(--red-text)', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
        {service.status}
      </span>
    </div>
  )
}

function Dashboard({ services, incidents, stats, events = [], onAddService, onViewIncidentDetails }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const getSeverityStyle = (severity) => ({
    CRITICAL: { background: 'var(--red-bg)', color: 'var(--red-text)', border: '1px solid var(--red-border)' },
    WARNING:  { background: 'var(--yellow-bg)', color: 'var(--yellow-text)', border: '1px solid var(--yellow-border)' },
    INFO:     { background: 'var(--blue-bg)', color: 'var(--blue-text)', border: '1px solid var(--blue-border)' },
  }[severity] || { background: 'var(--bg-raised)', color: 'var(--text-2)', border: '1px solid var(--border)' })

  const getStatusStyle = (status) =>
    status === 'ACTIVE'
      ? { background: 'var(--yellow-bg)', color: 'var(--yellow-text)', border: '1px solid var(--yellow-border)' }
      : { background: 'var(--green-bg)', color: 'var(--green-text)', border: '1px solid var(--green-border)' }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Live Stats Banner */}
      <LiveStats services={services} events={events} incidents={incidents} />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {STAT_CARDS.map(card => (
          <StatCard
            key={card.key}
            label={card.label}
            value={`${stats[card.key]}${card.suffix || ''}`}
            icon={card.icon}
            accent={card.accent}
          />
        ))}
      </div>

      {/* Services Table */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12 }} className="mb-6 overflow-hidden">
        <div style={{ borderBottom: '1px solid var(--border)', padding: '16px 20px' }} className="flex items-center justify-between">
          <div>
            <h2 style={{ color: 'var(--text-1)', fontSize: 14, fontWeight: 600, margin: 0 }}>Services</h2>
            <p style={{ color: 'var(--text-3)', fontSize: 12, margin: '2px 0 0' }}>All monitored endpoints</p>
          </div>
          <button onClick={onAddService}
            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            className="hover:bg-blue-500 transition-colors">
            <Plus className="w-3.5 h-3.5" />Add Service
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full pro-table">
            <thead>
              <tr>
                {['Service', 'Type', 'Status', 'Response', 'Trend', 'Uptime', 'Last Check'].map(h => (
                  <th key={h} style={{ background: 'transparent' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map(svc => (
                <tr key={svc.id}>
                  <td>
                    <div style={{ color: 'var(--text-1)', fontSize: 13, fontWeight: 500 }}>{svc.name}</div>
                    <div style={{ color: 'var(--text-3)', fontSize: 11, marginTop: 2 }} className="font-mono truncate max-w-[180px]">{svc.url}</div>
                  </td>
                  <td>
                    <span style={{ background: 'var(--bg-raised)', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
                      {svc.type}
                    </span>
                  </td>
                  <td><StatusBadge service={svc} /></td>
                  <td>
                    <span style={{ color: svc.status === 'UP' ? 'var(--green-text)' : 'var(--text-3)', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600 }}>
                      {svc.status === 'UP' ? `${svc.responseTime}ms` : '—'}
                    </span>
                  </td>
                  <td>
                    <Sparkline data={svc.history || []} status={svc.status} width={100} height={32} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 48, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 2,
                          width: `${svc.checkCount ? svc.uptime : 0}%`,
                          background: svc.uptime >= 99 ? 'var(--success)' : svc.uptime >= 95 ? 'var(--warning)' : 'var(--danger)'
                        }} />
                      </div>
                      <span style={{ color: svc.checkCount ? (svc.uptime >= 99 ? 'var(--success)' : svc.uptime >= 95 ? 'var(--warning)' : 'var(--danger)') : 'var(--text-3)', fontSize: 12, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>
                        {svc.checkCount ? `${svc.uptime}%` : '—'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-3)', fontSize: 12 }}>{relativeTime(svc.lastCheckedAt)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row: Feed + Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveFeed events={events} />

        {/* Incidents */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12 }} className="overflow-hidden">
          <div style={{ borderBottom: '1px solid var(--border)', padding: '16px 20px' }}>
            <h2 style={{ color: 'var(--text-1)', fontSize: 14, fontWeight: 600, margin: 0 }}>Recent Incidents</h2>
          </div>
          <div className="p-4 space-y-3">
            {incidents.length === 0 ? (
              <div className="py-10 flex flex-col items-center gap-2">
                <ShieldCheck style={{ color: 'var(--success)' }} className="w-8 h-8" />
                <p style={{ color: 'var(--text-3)', fontSize: 13 }}>All systems operational</p>
              </div>
            ) : incidents.slice(0, 4).map(inc => (
              <div key={inc.id}
                style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}
                className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span style={{ ...getSeverityStyle(inc.severity), borderRadius: 4, padding: '1px 8px', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em' }}>
                      {inc.severity}
                    </span>
                    <span style={{ ...getStatusStyle(inc.status), borderRadius: 4, padding: '1px 8px', fontSize: 10, fontWeight: 600 }}>
                      {inc.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-1)', fontSize: 13, fontWeight: 500 }} className="truncate">{inc.serviceName}</p>
                  <p style={{ color: 'var(--text-3)', fontSize: 11, marginTop: 2 }} className="truncate">{inc.message}</p>
                </div>
                <button onClick={() => onViewIncidentDetails(inc)}
                  style={{ color: 'var(--blue-text)', fontSize: 11, fontWeight: 500, background: 'var(--blue-bg)', border: '1px solid var(--blue-border)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', flexShrink: 0 }}
                  className="hover:bg-[var(--hover-bg)] transition-colors">
                  Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
