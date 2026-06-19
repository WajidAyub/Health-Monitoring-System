import { BarChart3, Download, TrendingUp, Clock, AlertTriangle, Activity } from 'lucide-react'

function ResponseChart({ services }) {
  const W = 760, H = 200
  const PAD = { top: 12, right: 16, bottom: 28, left: 44 }
  const inner = { w: W - PAD.left - PAD.right, h: H - PAD.top - PAD.bottom }
  const maxLen = Math.max(...services.map(s => (s.history || []).length), 0)
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#a78bfa', '#ef4444']

  if (maxLen === 0) return (
    <div style={{ height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--text-3)' }}>
      <Activity className="w-8 h-8" />
      <p style={{ fontSize: 13 }}>Waiting for first check data…</p>
    </div>
  )

  const allVals = services.flatMap(s => s.history || []).filter(v => v < 10000)
  const maxY = Math.max(...allVals, 100)
  const yTicks = [0, 0.25, 0.5, 0.75, 1]

  const toPath = (history, color) => {
    if (history.length < 2) return null
    const pts = history.map((v, i) => {
      const x = PAD.left + (i / (maxLen - 1)) * inner.w
      const y = PAD.top  + (1 - Math.min(v, 10000) / maxY) * inner.h
      return [x, y]
    })
    const d = pts.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(' ')
    return <polyline key={color} points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
      {/* Grid lines */}
      {yTicks.map(f => {
        const y = PAD.top + (1 - f) * inner.h
        const val = Math.round(maxY * f)
        return (
          <g key={f}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="var(--border)" strokeDasharray="4 4" />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="var(--text-3)" fontFamily="JetBrains Mono, monospace">{val}</text>
          </g>
        )
      })}
      <text x={PAD.left - 36} y={PAD.top + inner.h / 2} fontSize="9" fill="var(--text-3)" textAnchor="middle"
        transform={`rotate(-90,${PAD.left - 36},${PAD.top + inner.h / 2})`}>ms</text>

      {services.map((svc, i) => toPath(svc.history || [], COLORS[i % COLORS.length]))}

      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="9" fill="var(--text-3)">Check #</text>
    </svg>
  )
}

function Reports({ services, incidents }) {
  const avgUptime = services.length
    ? (services.reduce((s, svc) => s + svc.uptime, 0) / services.length).toFixed(2) : '0.00'
  const upSvcs = services.filter(s => s.status === 'UP')
  const avgResponse = upSvcs.length
    ? Math.round(upSvcs.reduce((s, svc) => s + svc.responseTime, 0) / upSvcs.length) : 0
  const totalChecks = services.reduce((s, svc) => s + (svc.checkCount || 0), 0)
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#a78bfa', '#ef4444']

  const handleExport = () => {
    const data = {
      generatedAt: new Date().toISOString(), avgUptime, avgResponse, totalChecks,
      totalIncidents: incidents.length,
      services: services.map(s => ({ name: s.name, url: s.url, status: s.status, uptime: s.uptime, responseTime: s.responseTime, checkCount: s.checkCount, history: s.history }))
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a')
    a.href = url; a.download = `health-report-${Date.now()}.json`; a.click(); URL.revokeObjectURL(url)
  }

  const summaryCards = [
    { label: 'Avg Uptime',      value: `${avgUptime}%`,      icon: TrendingUp,    color: '#3b82f6', sub: 'All services' },
    { label: 'Avg Response',    value: `${avgResponse} ms`,  icon: Clock,         color: '#10b981', sub: 'UP services only' },
    { label: 'Total Checks',    value: totalChecks,           icon: Activity,      color: '#a78bfa', sub: 'This session' },
    { label: 'Total Incidents', value: incidents.length,      icon: AlertTriangle, color: '#f59e0b', sub: 'This session' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color: 'var(--text-1)', fontSize: 22, fontWeight: 700, margin: 0 }}>Reports</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, margin: '4px 0 0' }}>Live analytics — updated after every check</p>
        </div>
        <button onClick={handleExport}
          style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}
          className="hover:bg-blue-500 transition-colors">
          <Download className="w-4 h-4" />Export JSON
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}
              className="hover:border-[rgba(148,163,184,0.2)] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <p style={{ color: 'var(--text-3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>{card.label}</p>
                <div style={{ background: `${card.color}18`, borderRadius: 7, padding: 7 }}>
                  <Icon style={{ color: card.color }} className="w-4 h-4" />
                </div>
              </div>
              <p style={{ color: 'var(--text-1)', fontSize: 26, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', margin: '0 0 4px' }}>{card.value}</p>
              <p style={{ color: 'var(--text-3)', fontSize: 11, margin: 0 }}>{card.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ color: 'var(--text-1)', fontSize: 14, fontWeight: 600, margin: 0 }}>Response Time History</h2>
          <div className="flex flex-wrap gap-4">
            {services.map((svc, i) => (
              <div key={svc.id} className="flex items-center gap-1.5">
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                <span style={{ color: 'var(--text-2)', fontSize: 11 }}>{svc.name}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponseChart services={services} />
      </div>

      {/* Per-service table */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ color: 'var(--text-1)', fontSize: 14, fontWeight: 600, margin: 0 }}>Per-Service Statistics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full pro-table">
            <thead>
              <tr>
                {['Service', 'Status', 'Checks', 'Avg Response', 'Best', 'Worst', 'Uptime'].map(h => (
                  <th key={h} style={{ background: 'transparent' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((svc, i) => {
                const h   = svc.history || []
                const avg = h.length ? Math.round(h.reduce((a, b) => a + b, 0) / h.length) : 0
                const best  = h.length ? Math.min(...h) : 0
                const worst = h.length ? Math.max(...h) : 0
                return (
                  <tr key={svc.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                        <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>{svc.name}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', padding: '2px 8px', borderRadius: 4,
                        background: svc.status === 'UP' ? 'var(--green-bg)' : 'var(--red-bg)',
                        color: svc.status === 'UP' ? 'var(--green-text)' : 'var(--red-text)',
                        border: `1px solid ${svc.status === 'UP' ? 'var(--green-border)' : 'var(--red-border)'}`
                      }}>
                        {svc.status}
                      </span>
                    </td>
                    <td><span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-2)' }}>{svc.checkCount || 0}</span></td>
                    <td><span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-2)' }}>{avg ? `${avg}ms` : '—'}</span></td>
                    <td><span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--success)' }}>{best ? `${best}ms` : '—'}</span></td>
                    <td><span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--danger)' }}>{worst ? `${worst}ms` : '—'}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div style={{ width: 40, height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${svc.checkCount ? svc.uptime : 0}%`, background: svc.uptime >= 99 ? 'var(--success)' : 'var(--warning)', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: svc.checkCount ? (svc.uptime >= 99 ? 'var(--success)' : 'var(--warning)') : 'var(--text-3)' }}>
                          {svc.checkCount ? `${svc.uptime}%` : '—'}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Reports
