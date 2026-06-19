import { AlertTriangle, Clock, ShieldCheck } from 'lucide-react'

const SEVERITY = {
  CRITICAL: { bg: 'var(--red-bg)',  color: 'var(--red-text)', border: 'var(--red-border)' },
  WARNING:  { bg: 'var(--yellow-bg)', color: 'var(--yellow-text)', border: 'var(--yellow-border)' },
  INFO:     { bg: 'var(--blue-bg)',  color: 'var(--blue-text)', border: 'var(--blue-border)' },
}

const STATUS = {
  ACTIVE:   { bg: 'var(--yellow-bg)', color: 'var(--yellow-text)', border: 'var(--yellow-border)' },
  RESOLVED: { bg: 'var(--green-bg)', color: 'var(--green-text)', border: 'var(--green-border)' },
}

function Tag({ text, style }) {
  return (
    <span style={{
      background: style.bg, color: style.color,
      border: `1px solid ${style.border}`,
      borderRadius: 4, padding: '2px 8px',
      fontSize: 10, fontWeight: 700, letterSpacing: '0.06em'
    }}>
      {text}
    </span>
  )
}

function Incidents({ incidents, services, onAcknowledge, onViewDetails }) {
  const active   = incidents.filter(i => i.status === 'ACTIVE').length
  const resolved = incidents.filter(i => i.status === 'RESOLVED').length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color: 'var(--text-1)', fontSize: 22, fontWeight: 700, margin: 0 }}>Incidents</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, margin: '4px 0 0' }}>Monitor and manage service incidents</p>
        </div>
        <div className="flex items-center gap-3">
          {active > 0 && (
            <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)', color: 'var(--red-text)', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
              {active} Active
            </div>
          )}
          <div style={{ background: 'var(--green-bg)', border: '1px solid var(--green-border)', color: 'var(--green-text)', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600 }}>
            {resolved} Resolved
          </div>
        </div>
      </div>

      {incidents.length === 0 ? (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '60px 20px', textAlign: 'center' }}>
          <ShieldCheck style={{ color: 'var(--success)', margin: '0 auto 12px' }} className="w-12 h-12" />
          <p style={{ color: 'var(--text-1)', fontSize: 15, fontWeight: 500, margin: 0 }}>All systems operational</p>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4 }}>No incidents have been recorded</p>
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map(incident => {
            const sev = SEVERITY[incident.severity] || SEVERITY.INFO
            const sts = STATUS[incident.status]     || STATUS.RESOLVED
            return (
              <div key={incident.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${incident.status === 'ACTIVE' ? 'var(--danger)' : 'var(--border)'}`,
                  borderRadius: 12, padding: '16px 20px',
                  transition: 'border-color 0.2s'
                }}
                className="hover:border-[var(--border-hover)]">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: info */}
                  <div className="flex-1 min-w-0">
                    {/* Badges row */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Tag text={incident.severity} style={sev} />
                      <Tag text={incident.status}   style={sts} />
                      <span style={{ color: 'var(--text-3)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
                        #{incident.id.slice(-8)}
                      </span>
                    </div>

                    <h3 style={{ color: 'var(--text-1)', fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>
                      {incident.serviceName}
                    </h3>
                    <p style={{ color: 'var(--text-2)', fontSize: 13, margin: '0 0 12px', lineHeight: 1.5 }}>
                      {incident.message}
                    </p>

                    <div className="flex items-center gap-5" style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Started: <span style={{ color: 'var(--text-2)', fontWeight: 500 }}>{incident.started}</span>
                      </span>
                      {incident.duration && (
                        <span>Duration: <span style={{ color: 'var(--text-2)', fontWeight: 500 }}>{incident.duration}</span></span>
                      )}
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {incident.status === 'ACTIVE' && (
                      <button onClick={() => onAcknowledge(incident.id)}
                        style={{ background: 'var(--yellow-bg)', color: 'var(--yellow-text)', border: '1px solid var(--yellow-border)', borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                        className="hover:bg-[rgba(245,158,11,0.2)] transition-colors whitespace-nowrap">
                        Acknowledge
                      </button>
                    )}
                    <button onClick={() => onViewDetails(incident)}
                      style={{ background: 'var(--blue-bg)', color: 'var(--blue-text)', border: '1px solid var(--blue-border)', borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
                      className="hover:bg-[rgba(59,130,246,0.15)] transition-colors whitespace-nowrap">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Incidents
