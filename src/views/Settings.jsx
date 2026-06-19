import { useState } from 'react'
import { RefreshCw, Copy, Check, Bell, MessageSquare, Webhook, Key, Server, Shield } from 'lucide-react'

function Toggle({ checked, onChange }) {
  return (
    <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
      <div style={{
        width: 40, height: 22, borderRadius: 11, background: checked ? 'var(--blue-text)' : 'var(--border)',
        border: `1px solid ${checked ? 'var(--blue-text)' : 'var(--border)'}`,
        position: 'relative', transition: 'all 0.2s',
        boxShadow: checked ? '0 0 10px rgba(59,130,246,0.3)' : 'none'
      }}>
        <div style={{
          position: 'absolute', top: 2, left: checked ? 20 : 2,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
        }} />
      </div>
    </label>
  )
}

function Section({ title, icon: Icon, children }) {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ background: 'var(--blue-bg)', borderRadius: 7, padding: 7 }}>
          <Icon style={{ color: 'var(--blue-text)' }} className="w-4 h-4" />
        </div>
        <h2 style={{ color: 'var(--text-1)', fontSize: 14, fontWeight: 600, margin: 0 }}>{title}</h2>
      </div>
      <div style={{ padding: '8px 0' }}>{children}</div>
    </div>
  )
}

function ToggleRow({ label, sub, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}
      className="hover:bg-[var(--hover-bg)] transition-colors">
      <div>
        <p style={{ color: 'var(--text-2)', fontSize: 13, fontWeight: 500, margin: 0 }}>{label}</p>
        <p style={{ color: 'var(--text-3)', fontSize: 12, margin: '2px 0 0' }}>{sub}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

function Settings() {
  const [email,   setEmail]   = useState(true)
  const [sms,     setSms]     = useState(false)
  const [webhook, setWebhook] = useState(true)
  const [copied,  setCopied]  = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('hmp_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegen = () => {
    if (window.confirm('Regenerate API key? The current key will be invalidated.')) {
      alert('API key regenerated!')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 style={{ color: 'var(--text-1)', fontSize: 22, fontWeight: 700, margin: 0 }}>Settings</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 13, margin: '4px 0 0' }}>Configure your monitoring preferences</p>
      </div>

      {/* Notifications */}
      <Section title="Alert Notifications" icon={Bell}>
        <ToggleRow label="Email Notifications"   sub="Receive incident alerts and status updates via email" checked={email}   onChange={setEmail} />
        <ToggleRow label="SMS Notifications"     sub="Receive critical alerts via SMS messages"            checked={sms}     onChange={setSms} />
        <ToggleRow label="Webhook Notifications" sub="Send incident notifications to webhook endpoints"    checked={webhook} onChange={setWebhook} />
      </Section>

      {/* API Config */}
      <Section title="API Configuration" icon={Key}>
        <div style={{ padding: '12px 20px 20px' }}>
          <label style={{ color: 'var(--text-3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>API Key</label>
          <div className="flex items-center gap-2">
            <input readOnly value="hmp_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4"
              style={{ flex: 1, background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-2)', fontSize: 12, padding: '9px 12px', fontFamily: 'JetBrains Mono, monospace', outline: 'none' }} />
            <button onClick={handleCopy}
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', cursor: 'pointer', color: copied ? 'var(--success)' : 'var(--text-2)', transition: 'all 0.15s' }}
              title="Copy API Key">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button onClick={handleRegen}
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', cursor: 'pointer', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, transition: 'all 0.15s', whiteSpace: 'nowrap' }}
              className="hover:text-[var(--text-1)] hover:border-[var(--border-hover)] transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />Regenerate
            </button>
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ color: 'var(--text-3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Server URL</label>
            <input readOnly value="wss://monitor.example.com:8443"
              style={{ width: '100%', background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-2)', fontSize: 12, padding: '9px 12px', fontFamily: 'JetBrains Mono, monospace', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
      </Section>

      {/* Monitor Config */}
      <Section title="Monitor Settings" icon={Shield}>
        <div style={{ padding: '12px 20px 20px' }} className="space-y-4">
          {[
            { label: 'Check Interval',      sub: 'How often to check each service',          value: '30 seconds' },
            { label: 'Request Timeout',     sub: 'Max wait time before marking as DOWN',      value: '8 seconds' },
            { label: 'Protocol Version',    sub: 'Health Monitor Protocol version in use',    value: 'HMP v1.0' },
            { label: 'History Points',      sub: 'Sparkline data points retained per service',value: '20 checks' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <p style={{ color: 'var(--text-2)', fontSize: 13, fontWeight: 500, margin: 0 }}>{row.label}</p>
                <p style={{ color: 'var(--text-3)', fontSize: 12, margin: '2px 0 0' }}>{row.sub}</p>
              </div>
              <span style={{ color: 'var(--blue-text)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, background: 'var(--blue-bg)', border: '1px solid var(--blue-border)', borderRadius: 5, padding: '3px 9px' }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

export default Settings
