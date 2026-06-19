import { useState } from 'react'
import { User, Mail, Shield, Calendar, Save, Edit2, X, Lock } from 'lucide-react'

const FIELD_STYLE = {
  background: 'var(--bg-raised)', border: '1px solid var(--border)',
  borderRadius: 8, color: 'var(--text-1)', fontSize: 14, padding: '10px 14px',
  width: '100%', outline: 'none', fontFamily: 'Inter, sans-serif'
}

function Profile({ user, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name:   user?.name   || '',
    email:  user?.email  || '',
    role:   user?.role   || 'User',
    avatar: user?.avatar || 'A'
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) return
    onUpdateUser({ ...user, ...formData, updatedAt: new Date().toISOString() })
    setIsEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleCancel = () => {
    setFormData({ name: user?.name || '', email: user?.email || '', role: user?.role || 'User', avatar: user?.avatar || 'A' })
    setIsEditing(false)
  }

  const roleColor = formData.role === 'Administrator'
    ? { bg: 'var(--red-bg)', color: 'var(--red-text)', border: 'var(--red-border)' }
    : { bg: 'var(--blue-bg)', color: 'var(--blue-text)', border: 'var(--blue-border)' }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Header */}
      <div className="mb-6">
        <h1 style={{ color: 'var(--text-1)', fontSize: 22, fontWeight: 700, margin: 0 }}>Profile</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 13, margin: '4px 0 0' }}>Manage your account information</p>
      </div>

      {/* Success toast inline */}
      {saved && (
        <div style={{ background: 'var(--green-bg)', border: '1px solid var(--green-border)', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: 'var(--green-text)', fontSize: 13, fontWeight: 500 }}>
          ✓ Profile updated successfully
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Avatar Card */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: 16, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 32, fontWeight: 700, color: '#fff', boxShadow: '0 0 24px rgba(59,130,246,0.3)' }}>
            {formData.avatar}
          </div>
          <h2 style={{ color: 'var(--text-1)', fontSize: 16, fontWeight: 600, margin: '0 0 4px' }}>{formData.name || 'User'}</h2>
          <p style={{ color: 'var(--text-3)', fontSize: 13, margin: '0 0 12px' }}>{formData.email}</p>
          <span style={{ ...roleColor, borderRadius: 5, padding: '3px 10px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', border: `1px solid ${roleColor.border}`, display: 'inline-block' }}>
            {formData.role.toUpperCase()}
          </span>
          {user?.createdAt && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', color: 'var(--text-3)', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Calendar className="w-3.5 h-3.5" />
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Info + Security */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal Information */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ color: 'var(--text-1)', fontSize: 14, fontWeight: 600, margin: 0 }}>Personal Information</h3>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)}
                  style={{ background: 'var(--blue-bg)', color: 'var(--blue-text)', border: '1px solid var(--blue-border)', borderRadius: 7, padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Edit2 className="w-3.5 h-3.5" />Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleCancel}
                    style={{ background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: 7, padding: '5px 12px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <X className="w-3.5 h-3.5" />Cancel
                  </button>
                  <button onClick={handleSave}
                    style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 7, padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Save className="w-3.5 h-3.5" />Save
                  </button>
                </div>
              )}
            </div>

            <div style={{ padding: 20 }} className="space-y-4">
              {/* Full Name */}
              <div>
                <label style={{ color: 'var(--text-3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                  <User className="w-3.5 h-3.5" />Full Name
                </label>
                {isEditing ? (
                  <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    style={FIELD_STYLE} placeholder="Enter your name"
                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)' }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }} />
                ) : (
                  <p style={{ color: 'var(--text-2)', fontSize: 14, margin: 0, padding: '10px 0' }}>{formData.name || '—'}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={{ color: 'var(--text-3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                  <Mail className="w-3.5 h-3.5" />Email Address
                </label>
                {isEditing ? (
                  <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    style={FIELD_STYLE} placeholder="Enter your email"
                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)' }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }} />
                ) : (
                  <p style={{ color: 'var(--text-2)', fontSize: 14, margin: 0, padding: '10px 0' }}>{formData.email || '—'}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label style={{ color: 'var(--text-3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                  <Shield className="w-3.5 h-3.5" />Role
                </label>
                {isEditing ? (
                  <select value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value }))} style={FIELD_STYLE}>
                    <option value="User">User</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                ) : (
                  <p style={{ color: 'var(--text-2)', fontSize: 14, margin: 0, padding: '10px 0' }}>{formData.role}</p>
                )}
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ color: 'var(--text-1)', fontSize: 14, fontWeight: 600, margin: 0 }}>Security</h3>
            </div>
            <div style={{ padding: 12 }} className="space-y-2">
              {[
                { icon: Lock,   label: 'Change Password',          sub: 'Update your password regularly' },
                { icon: Shield, label: 'Two-Factor Authentication', sub: 'Add an extra layer of security' },
              ].map(item => {
                const Icon = item.icon
                return (
                  <button key={item.label}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px', borderRadius: 8, background: 'transparent', border: '1px solid transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                    className="hover:bg-[var(--hover-bg)] hover:border-[var(--border-hover)]">
                    <div style={{ background: 'var(--border)', borderRadius: 8, padding: 8 }}>
                      <Icon style={{ color: 'var(--text-3)' }} className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p style={{ color: 'var(--text-2)', fontSize: 13, fontWeight: 500, margin: 0 }}>{item.label}</p>
                      <p style={{ color: 'var(--text-3)', fontSize: 12, margin: '2px 0 0' }}>{item.sub}</p>
                    </div>
                    <span style={{ color: 'var(--text-3)', fontSize: 16 }}>›</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
