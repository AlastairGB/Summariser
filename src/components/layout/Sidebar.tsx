import React, { useState } from 'react'
import { 
  MessageSquare, 
  Star, 
  Trash2, 
  Edit3, 
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

export const Sidebar: React.FC = () => {
  const { 
    summaries, 
    isSidebarOpen, 
    toggleSidebar, 
    deleteSummary, 
    toggleFavorite,
    setCurrentSummary,
    currentSummary 
  } = useStore()
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const handleEdit = (summary: any) => {
    setEditingId(summary.id)
    setEditTitle(summary.title)
  }

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      // Update summary title
      setEditingId(null)
      setEditTitle('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'video':
        return '🎥'
      case 'article':
        return '📄'
      case 'text':
        return '📝'
      default:
        return '📄'
    }
  }

  return (
    <div className={cn(
      'flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
      isSidebarOpen ? 'w-80' : 'w-16'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {isSidebarOpen && (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Saved Summaries
          </h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="ml-auto"
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isSidebarOpen ? (
          <div className="p-4 space-y-2">
            {summaries.map((summary) => (
              <div
                key={summary.id}
                className={cn(
                  'group relative p-3 rounded-lg border cursor-pointer transition-all hover:bg-white dark:hover:bg-gray-800',
                  currentSummary?.id === summary.id 
                    ? 'bg-white dark:bg-gray-800 border-primary-200 dark:border-primary-700' 
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                )}
                onClick={() => setCurrentSummary(summary)}
              >
                {/* Summary Item */}
                <div className="flex items-start space-x-3">
                  <div className="text-lg">{getSourceIcon(summary.sourceType)}</div>
                  <div className="flex-1 min-w-0">
                    {editingId === summary.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleSaveEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit()
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        className="w-full text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0"
                        autoFocus
                      />
                    ) : (
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {summary.title}
                      </h3>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(summary.createdAt)}
                    </p>
                    <div className="flex items-center space-x-1 mt-2">
                      <span className={cn(
                        'px-2 py-1 text-xs rounded-full',
                        summary.summaryLength === 'short' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                        summary.summaryLength === 'medium' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                        summary.summaryLength === 'long' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      )}>
                        {summary.summaryLength}
                      </span>
                      <span className={cn(
                        'px-2 py-1 text-xs rounded-full',
                        summary.knowledgeLevel === 'beginner' && 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                        summary.knowledgeLevel === 'intermediate' && 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
                        summary.knowledgeLevel === 'advanced' && 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      )}>
                        {summary.knowledgeLevel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(summary.id)
                    }}
                    className="p-1 h-6 w-6"
                  >
                    <Star 
                      size={14} 
                      className={cn(
                        summary.isFavorite 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-400'
                      )} 
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(summary)
                    }}
                    className="p-1 h-6 w-6"
                  >
                    <Edit3 size={14} className="text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSummary(summary.id)
                    }}
                    className="p-1 h-6 w-6 hover:text-red-600"
                  >
                    <Trash2 size={14} className="text-gray-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {summaries.slice(0, 5).map((summary) => (
              <div
                key={summary.id}
                className={cn(
                  'p-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-gray-700',
                  currentSummary?.id === summary.id && 'bg-gray-200 dark:bg-gray-700'
                )}
                onClick={() => setCurrentSummary(summary)}
                title={summary.title}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">{getSourceIcon(summary.sourceType)}</div>
                  {summary.isFavorite && (
                    <Star size={12} className="text-yellow-400 mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {isSidebarOpen && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setCurrentSummary(null)}
          >
            <Plus size={16} className="mr-2" />
            New Summary
          </Button>
        </div>
      )}
    </div>
  )
} 