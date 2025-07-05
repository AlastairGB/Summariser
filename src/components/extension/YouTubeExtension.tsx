import React, { useState } from 'react'
import { Play, X, Maximize2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

interface YouTubeExtensionProps {
  videoUrl: string
  videoTitle: string
  onClose: () => void
  onSummarize: (url: string) => void
}

export const YouTubeExtension: React.FC<YouTubeExtensionProps> = ({
  videoUrl,
  videoTitle,
  onClose,
  onSummarize
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300',
        isExpanded ? 'w-96 h-96' : 'w-80 h-auto'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
              <Play size={12} className="text-white" />
            </div>
            <span className="font-medium text-gray-900 dark:text-white">
              AI Summarizer
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1"
            >
              <Maximize2 size={16} className="text-gray-500 dark:text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1"
            >
              <X size={16} className="text-gray-500 dark:text-gray-400" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {!isExpanded ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Summarize This Video
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {videoTitle}
                </p>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => onSummarize(videoUrl)}
                  className="w-full"
                >
                  <Play size={16} className="mr-2" />
                  Generate Summary
                </Button>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Click to create an AI-powered summary of this video
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Video Details
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {videoTitle}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {videoUrl}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Summary Length
                    </label>
                    <div className="flex space-x-2">
                      {(['short', 'medium', 'long'] as const).map((length) => (
                        <Button
                          key={length}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          {length.charAt(0).toUpperCase() + length.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Knowledge Level
                    </label>
                    <div className="flex space-x-2">
                      {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                        <Button
                          key={level}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => onSummarize(videoUrl)}
                  className="w-full"
                >
                  <Play size={16} className="mr-2" />
                  Generate Summary
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// YouTube page injection script
export const injectYouTubeButton = () => {
  // Check if we're on a YouTube video page
  if (!window.location.hostname.includes('youtube.com')) return

  // Create the summarize button
  const button = document.createElement('button')
  button.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="5,3 19,12 5,21"></polygon>
      </svg>
      Summarize Video
    </div>
  `

  // Add hover effects
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-2px)'
    button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)'
  })

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0)'
    button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
  })

  // Add click handler
  button.addEventListener('click', () => {
    const videoTitle = document.querySelector('h1.ytd-video-primary-info-renderer')?.textContent || 'YouTube Video'
    const videoUrl = window.location.href
    
    // Open the main app with the video URL
    window.open(`http://localhost:3000?video=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(videoTitle)}`, '_blank')
  })

  // Add to page
  document.body.appendChild(button)

  // Remove button when leaving YouTube
  const observer = new MutationObserver(() => {
    if (!window.location.hostname.includes('youtube.com')) {
      button.remove()
      observer.disconnect()
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
} 