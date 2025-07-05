import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Summary {
  id: string
  title: string
  content: string
  source: string
  sourceType: 'video' | 'article' | 'text'
  outputType: 'text' | 'video'
  summaryLength: 'short' | 'medium' | 'long'
  knowledgeLevel: 'beginner' | 'intermediate' | 'advanced'
  createdAt: Date
  isFavorite: boolean
  tags: string[]
}

export interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
  duration: string
}

interface AppState {
  // Theme
  isDarkMode: boolean
  toggleTheme: () => void
  
  // Sidebar
  isSidebarOpen: boolean
  toggleSidebar: () => void
  
  // Summaries
  summaries: Summary[]
  addSummary: (summary: Omit<Summary, 'id' | 'createdAt'>) => void
  updateSummary: (id: string, updates: Partial<Summary>) => void
  deleteSummary: (id: string) => void
  toggleFavorite: (id: string) => void
  
  // Current summary
  currentSummary: Summary | null
  setCurrentSummary: (summary: Summary | null) => void
  
  // YouTube search
  youtubeVideos: YouTubeVideo[]
  setYoutubeVideos: (videos: YouTubeVideo[]) => void
  
  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

// Mock data for initial summaries
const mockSummaries: Summary[] = [
  {
    id: '1',
    title: 'React 18 New Features Explained',
    content: 'React 18 introduces concurrent features, automatic batching, and new APIs like useTransition and useDeferredValue. The new concurrent renderer allows React to work on multiple versions of the UI simultaneously, improving user experience with better loading states and transitions.',
    source: 'https://www.youtube.com/watch?v=react18',
    sourceType: 'video',
    outputType: 'text',
    summaryLength: 'medium',
    knowledgeLevel: 'intermediate',
    createdAt: new Date('2024-01-15'),
    isFavorite: true,
    tags: ['react', 'javascript', 'frontend']
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    content: 'Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. Key concepts include supervised learning, unsupervised learning, and reinforcement learning.',
    source: 'https://example.com/ml-article',
    sourceType: 'article',
    outputType: 'text',
    summaryLength: 'long',
    knowledgeLevel: 'beginner',
    createdAt: new Date('2024-01-10'),
    isFavorite: false,
    tags: ['ai', 'machine-learning', 'tutorial']
  },
  {
    id: '3',
    title: 'TypeScript Best Practices',
    content: 'TypeScript provides static typing for JavaScript, helping catch errors at compile time. Best practices include using strict mode, proper type definitions, and leveraging advanced types like generics and utility types.',
    source: 'https://www.youtube.com/watch?v=typescript-best-practices',
    sourceType: 'video',
    outputType: 'video',
    summaryLength: 'short',
    knowledgeLevel: 'advanced',
    createdAt: new Date('2024-01-08'),
    isFavorite: true,
    tags: ['typescript', 'javascript', 'programming']
  },
  {
    id: '4',
    title: 'Web Development Trends 2024',
    content: 'The web development landscape in 2024 is dominated by AI integration, improved performance optimization, and enhanced developer experience. Key trends include AI-powered development tools, WebAssembly adoption, and progressive web apps.',
    source: 'https://example.com/web-dev-trends',
    sourceType: 'article',
    outputType: 'text',
    summaryLength: 'medium',
    knowledgeLevel: 'intermediate',
    createdAt: new Date('2024-01-05'),
    isFavorite: false,
    tags: ['web-development', 'trends', 'technology']
  },
  {
    id: '5',
    title: 'Docker Containerization Guide',
    content: 'Docker provides containerization technology that packages applications with their dependencies. This guide covers Docker basics, Dockerfile creation, container management, and best practices for production deployments.',
    source: 'https://www.youtube.com/watch?v=docker-guide',
    sourceType: 'video',
    outputType: 'text',
    summaryLength: 'long',
    knowledgeLevel: 'beginner',
    createdAt: new Date('2024-01-03'),
    isFavorite: true,
    tags: ['docker', 'devops', 'containers']
  }
]

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      isDarkMode: false,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      // Sidebar
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      // Summaries
      summaries: mockSummaries,
      addSummary: (summary) => set((state) => ({
        summaries: [{
          ...summary,
          id: Date.now().toString(),
          createdAt: new Date()
        }, ...state.summaries]
      })),
      updateSummary: (id, updates) => set((state) => ({
        summaries: state.summaries.map(summary => 
          summary.id === id ? { ...summary, ...updates } : summary
        )
      })),
      deleteSummary: (id) => set((state) => ({
        summaries: state.summaries.filter(summary => summary.id !== id)
      })),
      toggleFavorite: (id) => set((state) => ({
        summaries: state.summaries.map(summary => 
          summary.id === id ? { ...summary, isFavorite: !summary.isFavorite } : summary
        )
      })),
      
      // Current summary
      currentSummary: null,
      setCurrentSummary: (summary) => set({ currentSummary: summary }),
      
      // YouTube search
      youtubeVideos: [],
      setYoutubeVideos: (videos) => set({ youtubeVideos: videos }),
      
      // Loading states
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'ai-summarizer-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        summaries: state.summaries,
      }),
    }
  )
) 