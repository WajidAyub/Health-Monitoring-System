import { useEffect, useState } from 'react'
import { Wifi, Clock, Zap, AlertTriangle, Timer } from 'lucide-react'

function LiveStats({ services = [], events = [], incidents = [] }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const totalChecks     = services.reduce((s, svc) => s + (svc.checkCount || 0), 0)
  const upServices      = services.filter(s => s.status === 'UP' && s.lastCheckedAt)
  const avgResponse     = upServices.length
    ? Math.round(upServices.reduce((s, svc) => s + svc.responseTime, 0) / upServices.length) : 0
  const activeIncidents = incidents.filter(i => i.status === 'ACTIVE').length
  const latestEvent     = events[0]
  const lastCheckAgo    = latestEvent ? Math.floor((Date.now() - latestEvent.timestamp) / 1000) : null
  const nextChecks      = services.filter(s => s.nextCheckAt).map(s => s.nextCheckAt)
  const nextCheckIn     = nextChecks.length ? Math.max(0, Math.ceil((Math.min(...nextChecks) - Date.now()) / 1000)) : null

  const items = [
    { icon: <Wifi className="w-3.5 h-3.5" />, label: 'Total Checks', value: totalChecks.toLocaleString(), color: 'var(--success)' },
    { icon: <Zap className="w-3.5 h-3.5" />,  label: 'Avg Response', value: upServices.length ? `${avgResponse} ms` : '—', color: 'var(--accent)' },
    { icon: <Clock className="w-3.5 h-3.5" />, label: 'Last Check',
      value: lastCheckAgo === null ? 'Pending…' : lastCheckAgo < 5 ? 'Just now' : lastCheckAgo < 60 ? `${lastCheckAgo}s ago` : `${Math.floor(lastCheckAgo / 60)}m ago`,
      color: 'var(--text-2)' },
    { icon: <Timer className="w-3.5 h-3.5" />, label: 'Next Check',
      value: nextCheckIn === null ? 'Pending…' : nextCheckIn === 0 ? 'Now…' : `in ${nextCheckIn}s`,
      color: nextCheckIn !== null && nextCheckIn <= 5 ? 'var(--warning)' : 'var(--text-3)',
      pulse: nextCheckIn !== null && nextCheckIn <= 5 },
    { icon: <AlertTriangle className="w-3.5 h-3.5" />, label: 'Incidents',
      value: activeIncidents, color: activeIncidents > 0 ? 'var(--danger)' : 'var(--text-3)' },
  ]

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10 }}
      className="flex flex-wrap items-center gap-5 px-4 py-2.5 mb-6">
      {/* Live indicator */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span style={{ color: 'var(--success)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>LIVE</span>
      </div>

      <div style={{ width: 1, height: 16, background: 'var(--border)' }} />

      {items.map(item => (
        <div key={item.label} className="flex items-center gap-2">
          <span style={{ color: item.color }}>{item.icon}</span>
          <span style={{ color: 'var(--text-3)', fontSize: 11 }}>{item.label}</span>
          <span style={{ color: item.color, fontSize: 12, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}
            className={item.pulse ? 'animate-pulse' : ''}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default LiveStats
