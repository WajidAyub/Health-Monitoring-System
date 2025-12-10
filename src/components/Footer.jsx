function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-auto shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Health Monitor System <span className="text-blue-600 dark:text-blue-400">v1.0</span> | Protocol: <span className="text-blue-600 dark:text-blue-400">HMP v1.0</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Computer Networks (Comp-352) - Fall 2025
            </p>
          </div>
          
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium">
              Documentation
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium">
              API Reference
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
