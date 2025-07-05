import React, { useEffect } from 'react'
import { useStore } from './store/useStore'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { SummaryTabs } from './components/content/SummaryTabs'
import { SummaryView } from './components/content/SummaryView'
import { cn } from './utils/cn'

export const App: React.FC = () => {
  const { isDarkMode, currentSummary } = useStore()

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-full">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header />
          
          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {currentSummary ? (
              <>
                {/* Summary Creation Panel */}
                <div className="w-1/2 border-r border-gray-200 dark:border-gray-700">
                  <SummaryTabs />
                </div>
                
                {/* Summary View Panel */}
                <div className="w-1/2">
                  <SummaryView />
                </div>
              </>
            ) : (
              /* Full width when no summary is selected */
              <div className="flex-1">
                <SummaryTabs />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 