import React, { useState } from 'react'
import { 
  Copy, 
  Download, 
  Share2, 
  ChevronDown, 
  ChevronUp,
  Star,
  ExternalLink,
  Play,
  FileText
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

export const SummaryView: React.FC = () => {
  const { currentSummary, toggleFavorite } = useStore()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']))

  if (!currentSummary) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Summary Selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Select a summary from the sidebar or create a new one
          </p>
        </div>
      </div>
    )
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSummary.content)
  }

  const handleDownload = () => {
    const blob = new Blob([currentSummary.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentSummary.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentSummary.title,
        text: currentSummary.content,
        url: window.location.href
      })
    } else {
      handleCopy()
    }
  }

  const sections = [
    {
      id: 'summary',
      title: 'Summary',
      content: currentSummary.content,
      icon: FileText
    },
    {
      id: 'key-points',
      title: 'Key Points',
      content: '• First key point of the summary\n• Second important point\n• Third main takeaway\n• Fourth critical insight',
      icon: Star
    },
    {
      id: 'source',
      title: 'Source Information',
      content: `Source: ${currentSummary.source}\nType: ${currentSummary.sourceType}\nLength: ${currentSummary.summaryLength}\nLevel: ${currentSummary.knowledgeLevel}`,
      icon: ExternalLink
    }
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentSummary.title}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(currentSummary.id)}
                className="p-1"
              >
                <Star 
                  size={16} 
                  className={cn(
                    currentSummary.isFavorite 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-400'
                  )} 
                />
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{new Date(currentSummary.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="capitalize">{currentSummary.summaryLength}</span>
              <span>•</span>
              <span className="capitalize">{currentSummary.knowledgeLevel}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy size={16} className="mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download size={16} className="mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 size={16} className="mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {sections.map((section) => {
            const Icon = section.icon
            const isExpanded = expandedSections.has(section.id)
            
            return (
              <div key={section.id} className="card">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={20} className="text-gray-500 dark:text-gray-400" />
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {section.title}
                    </h3>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="px-4 pb-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                        {section.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Tags */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentSummary.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="md:hidden p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleCopy}>
            <Copy size={16} className="mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={handleDownload}>
            <Download size={16} className="mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
            <Share2 size={16} className="mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )
} 