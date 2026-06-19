function Footer() {
  return (
    <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }} className="mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p style={{ color: 'var(--text-1)' }} className="text-sm font-medium">
              Health Monitor System <span style={{ color: 'var(--blue-text)' }}>v1.0</span> | Protocol: <span style={{ color: 'var(--blue-text)' }}>HMP v1.0</span>
            </p>
            <p style={{ color: 'var(--text-3)' }} className="text-xs mt-1">
              Computer Networks (Comp-352) - Fall 2025
            </p>
          </div>
          
          <div className="flex gap-6 text-sm">
            <a href="#" style={{ color: 'var(--text-2)' }} className="hover:text-[var(--blue-text)] transition-colors duration-200 font-medium">
              Documentation
            </a>
            <a href="#" style={{ color: 'var(--text-2)' }} className="hover:text-[var(--blue-text)] transition-colors duration-200 font-medium">
              API Reference
            </a>
            <a href="#" style={{ color: 'var(--text-2)' }} className="hover:text-[var(--blue-text)] transition-colors duration-200 font-medium">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
