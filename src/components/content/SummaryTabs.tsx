import React, { useState } from 'react'
import { 
  Link, 
  Youtube, 
  FileText, 
  Upload,
  Play,
  Search,
  Send
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { cn } from '../../utils/cn'

type TabType = 'url' | 'youtube' | 'text'

export const SummaryTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('url')
  const [url, setUrl] = useState('')
  const [youtubeQuery, setYoutubeQuery] = useState('')
  const [textContent, setTextContent] = useState('')
  const [outputType, setOutputType] = useState<'text' | 'video'>('text')
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [knowledgeLevel, setKnowledgeLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [isAdvanced, setIsAdvanced] = useState(false)

  const { addSummary, setIsLoading } = useStore()

  const tabs = [
    { id: 'url', label: 'Summarize by URL', icon: Link },
    { id: 'youtube', label: 'Search YouTube', icon: Youtube },
    { id: 'text', label: 'Upload/Paste Text', icon: FileText }
  ]

  const handleSummarize = async () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const newSummary = {
        title: `Summary of ${activeTab === 'url' ? 'URL' : activeTab === 'youtube' ? 'YouTube Video' : 'Text Content'}`,
        content: `This is a ${summaryLength} summary written for ${knowledgeLevel} level. The content has been processed and summarized according to your specifications.`,
        source: activeTab === 'url' ? url : activeTab === 'youtube' ? 'YouTube Search' : 'Text Input',
        sourceType: activeTab === 'youtube' ? 'video' : activeTab === 'url' ? 'article' : 'text',
        outputType,
        summaryLength,
        knowledgeLevel,
        isFavorite: false,
        tags: [activeTab, summaryLength, knowledgeLevel]
      }
      
      addSummary(newSummary)
      setIsLoading(false)
    }, 2000)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'url':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter URL
              </label>
              <div className="flex space-x-2">
                <Input
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSummarize} disabled={!url.trim()}>
                  <Send size={16} className="mr-2" />
                  Summarize
                </Button>
              </div>
            </div>
          </div>
        )

      case 'youtube':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search YouTube
              </label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Search for videos..."
                  value={youtubeQuery}
                  onChange={(e) => setYoutubeQuery(e.target.value)}
                  className="flex-1"
                />
                <Button variant="secondary">
                  <Search size={16} className="mr-2" />
                  Search
                </Button>
              </div>
            </div>
            
            {/* Mock YouTube results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card p-4 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                    <Play size={24} className="text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    Sample YouTube Video {i}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Channel Name • 10:30
                  </p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload File or Paste Text
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Or paste your text here
              </label>
              <Textarea
                placeholder="Paste your article, document, or any text content here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={8}
              />
            </div>
            
            <Button onClick={handleSummarize} disabled={!textContent.trim()}>
              <Send size={16} className="mr-2" />
              Summarize Text
            </Button>
          </div>
        )
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                )}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderTabContent()}
      </div>

      {/* Settings Panel */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Summary Settings
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdvanced(!isAdvanced)}
          >
            {isAdvanced ? 'Hide' : 'Show'} Advanced
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Output Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Output Type
            </label>
            <div className="flex space-x-2">
              <Button
                variant={outputType === 'text' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setOutputType('text')}
              >
                Text
              </Button>
              <Button
                variant={outputType === 'video' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setOutputType('video')}
              >
                Video
              </Button>
            </div>
          </div>

          {/* Summary Length */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Summary Length
            </label>
            <div className="flex space-x-2">
              {(['short', 'medium', 'long'] as const).map((length) => (
                <Button
                  key={length}
                  variant={summaryLength === length ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSummaryLength(length)}
                >
                  {length.charAt(0).toUpperCase() + length.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Knowledge Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Knowledge Level
            </label>
            <div className="flex space-x-2">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <Button
                  key={level}
                  variant={knowledgeLevel === level ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setKnowledgeLevel(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {isAdvanced && (
          <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Advanced Options
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Include Key Points
                </label>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Include Timestamps
                </label>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 