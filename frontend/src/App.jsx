import { useState, useEffect } from 'react'
import MapDashboard from './components/MapDashboard'
import ReportForm from './components/ReportForm'

function App() {
  const [view, setView] = useState('report') // 'report' or 'dashboard'
  const [isNightMode, setIsNightMode] = useState(false)

  useEffect(() => {
    if (isNightMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isNightMode])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-blue-600 dark:bg-nautical-surface-light text-white flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">OceanAlert</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setView(view === 'report' ? 'dashboard' : 'report')}
            className="px-4 py-2 bg-blue-700 dark:bg-nautical-surface rounded hover:bg-blue-800 dark:hover:bg-nautical-red-light transition-colors"
          >
            Switch to {view === 'report' ? 'Dashboard' : 'Report'}
          </button>
          <button 
            onClick={() => setIsNightMode(!isNightMode)}
            className="px-4 py-2 border border-white dark:border-nautical-red rounded hover:bg-white hover:text-blue-600 dark:hover:bg-nautical-red dark:hover:text-black transition-colors"
          >
            {isNightMode ? 'Day Mode' : 'Night Mode'}
          </button>
        </div>
      </header>
      
      <main className="flex-grow flex relative">
        {view === 'report' ? <ReportForm isNightMode={isNightMode} /> : <MapDashboard />}
      </main>
    </div>
  )
}

export default App
