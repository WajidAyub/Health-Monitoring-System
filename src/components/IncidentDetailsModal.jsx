import { X, Clock, AlertTriangle, Server, Calendar, Activity } from 'lucide-react'

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

function IncidentDetailsModal({ incident, service, onClose }) {
  if (!incident) return null

  const sev = SEVERITY[incident.severity] || SEVERITY.INFO
  const sts = STATUS[incident.status]     || STATUS.RESOLVED

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }} className="relative rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col animate-fade-in">
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)' }} className="p-5 flex items-center justify-between shrink-0">
          <h2 style={{ color: 'var(--text-1)', fontSize: 18, fontWeight: 600, margin: 0 }}>
            Incident Details
          </h2>
          <button onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-2)', cursor: 'pointer', padding: 4, borderRadius: 6 }}
            className="hover:bg-[var(--hover-bg)] hover:text-[var(--text-1)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content (scrollable) */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Top Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Tag text={incident.severity} style={sev} />
            <Tag text={incident.status}   style={sts} />
            <span style={{ color: 'var(--text-3)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', marginLeft: 4 }}>
              #{incident.id}
            </span>
          </div>

          {/* Service Information Box */}
          <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ background: 'var(--blue-bg)', borderRadius: 8, padding: 8 }}>
                <Server style={{ color: 'var(--blue-text)' }} className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 style={{ color: 'var(--text-1)', fontSize: 16, fontWeight: 600, margin: '0 0 2px' }} className="truncate">
                  {incident.serviceName}
                </h3>
                {service && (
                  <p style={{ color: 'var(--text-2)', fontSize: 13, margin: 0, fontFamily: 'JetBrains Mono, monospace' }} className="truncate">
                    {service.url}
                  </p>
                )}
              </div>
            </div>
            {service && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 4 }} className="grid grid-cols-2 gap-4">
                <div>
                  <p style={{ color: 'var(--text-3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Type</p>
                  <p style={{ color: 'var(--text-1)', fontSize: 13, fontWeight: 500, margin: 0 }}>{service.type}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Location</p>
                  <p style={{ color: 'var(--text-1)', fontSize: 13, fontWeight: 500, margin: 0 }}>{service.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message Box */}
          <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 10, padding: 16 }}>
            <div className="flex items-start gap-3">
              <AlertTriangle style={{ color: 'var(--red-text)', flexShrink: 0, marginTop: 2 }} className="w-5 h-5" />
              <div>
                <h4 style={{ color: 'var(--red-text)', fontSize: 13, fontWeight: 600, margin: '0 0 4px' }}>Error Message</h4>
                <p style={{ color: 'var(--red-text)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                  {incident.message}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div className="flex items-center gap-2 mb-2">
                <Clock style={{ color: 'var(--text-2)' }} className="w-4 h-4" />
                <h4 style={{ color: 'var(--text-2)', fontSize: 12, fontWeight: 500, margin: 0 }}>Started</h4>
              </div>
              <p style={{ color: 'var(--text-1)', fontSize: 14, fontWeight: 600, margin: 0 }}>{incident.started}</p>
            </div>
            <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div className="flex items-center gap-2 mb-2">
                <Activity style={{ color: 'var(--text-2)' }} className="w-4 h-4" />
                <h4 style={{ color: 'var(--text-2)', fontSize: 12, fontWeight: 500, margin: 0 }}>Duration</h4>
              </div>
              <p style={{ color: 'var(--text-1)', fontSize: 14, fontWeight: 600, margin: 0 }}>{incident.duration}</p>
            </div>
          </div>

          {/* Additional Raw Info */}
          <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
            <h4 style={{ color: 'var(--text-2)', fontSize: 12, fontWeight: 600, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar className="w-4 h-4" /> Technical Details
            </h4>
            <div style={{ color: 'var(--text-2)', fontSize: 12, lineHeight: 1.6 }} className="font-mono space-y-1">
              <div className="flex"><span className="w-32 text-[var(--text-3)]">Incident ID:</span> <span className="text-[var(--text-2)] truncate">{incident.id}</span></div>
              <div className="flex"><span className="w-32 text-[var(--text-3)]">Service ID:</span> <span className="text-[var(--text-2)] truncate">{incident.serviceId}</span></div>
              <div className="flex"><span className="w-32 text-[var(--text-3)]">Severity:</span> <span className="text-[var(--text-2)]">{incident.severity}</span></div>
              <div className="flex"><span className="w-32 text-[var(--text-3)]">Status:</span> <span className="text-[var(--text-2)]">{incident.status}</span></div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }} className="p-4 flex justify-end shrink-0 rounded-b-xl">
          <button onClick={onClose}
            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            className="hover:bg-blue-500 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default IncidentDetailsModal
