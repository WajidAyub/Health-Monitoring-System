import { CheckCircle, AlertTriangle, Activity } from 'lucide-react'
import { useState } from 'react'

function formatTime(ts) {
  if (!ts) return '—'
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 5)  return 'just now'
  if (diff < 60) return `${diff}s ago`
  return `${Math.floor(diff / 60)}m ago`
}

function LiveFeed({ events = [] }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12 }} className="overflow-hidden">
      <div
        style={{ borderBottom: collapsed ? 'none' : '1px solid var(--border)', padding: '14px 20px', cursor: 'pointer', userSelect: 'none' }}
        className="flex items-center justify-between"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <h2 style={{ color: 'var(--text-1)', fontSize: 14, fontWeight: 600, margin: 0 }}>Live Feed</h2>
          <span style={{ color: 'var(--text-3)', fontSize: 11, background: 'var(--bg-raised)', padding: '1px 7px', borderRadius: 10, border: '1px solid var(--border)' }}>
            {events.length}
          </span>
        </div>
        <Activity style={{ color: 'var(--text-3)' }} className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
      </div>

      {!collapsed && (
        <div style={{ maxHeight: 260, overflowY: 'auto' }}>
          {events.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
              Waiting for first check…
            </div>
          ) : (
            events.map(evt => (
              <div key={evt.id}
                style={{ padding: '9px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}
                className="hover:bg-[var(--hover-bg)] transition-colors">
                {evt.status === 'UP'
                  ? <CheckCircle style={{ color: 'var(--success)', flexShrink: 0 }} className="w-3.5 h-3.5" />
                  : <AlertTriangle style={{ color: 'var(--danger)', flexShrink: 0 }} className="w-3.5 h-3.5" />
                }
                <span style={{ color: 'var(--text-2)', fontSize: 12, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {evt.serviceName}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                  color: evt.status === 'UP' ? 'var(--green-text)' : 'var(--red-text)',
                  background: evt.status === 'UP' ? 'var(--green-bg)' : 'var(--red-bg)',
                  padding: '1px 6px', borderRadius: 4
                }}>
                  {evt.status}
                </span>
                <span style={{ color: 'var(--text-3)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', flexShrink: 0, minWidth: 52, textAlign: 'right' }}>
                  {evt.status === 'UP' ? `${evt.responseTime}ms` : 'timeout'}
                </span>
                <span style={{ color: 'var(--text-3)', fontSize: 11, flexShrink: 0, minWidth: 52, textAlign: 'right' }}>
                  {formatTime(evt.timestamp)}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default LiveFeed
