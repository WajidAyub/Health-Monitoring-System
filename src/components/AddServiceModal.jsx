import { X, Server } from 'lucide-react'

const FIELD_STYLE = {
  background: 'var(--bg-raised)', border: '1px solid var(--border)',
  borderRadius: 8, color: 'var(--text-1)', fontSize: 13, padding: '10px 14px',
  width: '100%', outline: 'none', fontFamily: 'Inter, sans-serif'
}

const LABEL_STYLE = {
  color: 'var(--text-3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
  textTransform: 'uppercase', display: 'block', marginBottom: 8
}

function AddServiceModal({ newService, setNewService, onClose, onAdd }) {
  const handleChange = (field, value) => {
    setNewService(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }} className="relative rounded-xl shadow-2xl w-full max-w-md mx-4 flex flex-col animate-fade-in">
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)' }} className="p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div style={{ background: 'var(--blue-bg)', borderRadius: 8, padding: 6 }}>
              <Server style={{ color: 'var(--blue-text)' }} className="w-4 h-4" />
            </div>
            <h2 style={{ color: 'var(--text-1)', fontSize: 18, fontWeight: 600, margin: 0 }}>
              Add New Service
            </h2>
          </div>
          <button onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-2)', cursor: 'pointer', padding: 4, borderRadius: 6 }}
            className="hover:bg-[var(--hover-bg)] hover:text-[var(--text-1)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <label style={LABEL_STYLE}>
              Service Name <span style={{ color: 'var(--red-text)' }}>*</span>
            </label>
            <input
              type="text"
              value={newService.name}
              onChange={(e) => handleChange('name', e.target.value)}
              style={FIELD_STYLE}
              onFocus={e => { e.target.style.borderColor = 'var(--blue-border)'; e.target.style.boxShadow = '0 0 0 3px var(--blue-bg)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
              placeholder="e.g., Production API"
            />
          </div>
          
          <div>
            <label style={LABEL_STYLE}>
              Service Type <span style={{ color: 'var(--red-text)' }}>*</span>
            </label>
            <select
              value={newService.type}
              onChange={(e) => handleChange('type', e.target.value)}
              style={FIELD_STYLE}
              onFocus={e => { e.target.style.borderColor = 'var(--blue-border)'; e.target.style.boxShadow = '0 0 0 3px var(--blue-bg)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
            >
              <option value="HTTP">HTTP</option>
              <option value="HTTPS">HTTPS</option>
              <option value="TCP">TCP</option>
              <option value="ICMP">ICMP</option>
            </select>
          </div>
          
          <div>
            <label style={LABEL_STYLE}>
              URL / Host <span style={{ color: 'var(--red-text)' }}>*</span>
            </label>
            <input
              type="text"
              value={newService.url}
              onChange={(e) => handleChange('url', e.target.value)}
              style={{ ...FIELD_STYLE, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}
              onFocus={e => { e.target.style.borderColor = 'var(--blue-border)'; e.target.style.boxShadow = '0 0 0 3px var(--blue-bg)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
              placeholder="https://api.example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={LABEL_STYLE}>Check Interval (s)</label>
              <input
                type="number"
                value={newService.checkInterval}
                onChange={(e) => handleChange('checkInterval', parseInt(e.target.value))}
                style={{ ...FIELD_STYLE, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}
                onFocus={e => { e.target.style.borderColor = 'var(--blue-border)'; e.target.style.boxShadow = '0 0 0 3px var(--blue-bg)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
                min="1"
              />
            </div>
            
            <div>
              <label style={LABEL_STYLE}>Timeout (s)</label>
              <input
                type="number"
                value={newService.timeout}
                onChange={(e) => handleChange('timeout', parseInt(e.target.value))}
                style={{ ...FIELD_STYLE, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}
                onFocus={e => { e.target.style.borderColor = 'var(--blue-border)'; e.target.style.boxShadow = '0 0 0 3px var(--blue-bg)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
                min="1"
              />
            </div>
          </div>
          
          <div style={{ background: 'var(--blue-bg)', border: '1px solid var(--blue-border)', borderRadius: 8, padding: 12 }}>
            <p style={{ color: 'var(--blue-text)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
              This service will be automatically polled every 30s using <strong>fetch()</strong> requests.
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-raised)' }} className="p-4 flex justify-end gap-3 shrink-0 rounded-b-xl">
          <button onClick={onClose}
            style={{ background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
            className="hover:border-[var(--border-hover)] hover:text-[var(--text-1)] transition-colors">
            Cancel
          </button>
          <button onClick={onAdd}
            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            className="hover:bg-blue-500 transition-colors">
            Add Service
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddServiceModal
