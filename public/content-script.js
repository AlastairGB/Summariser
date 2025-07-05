// Content script for YouTube video summarization
(function() {
  'use strict';

  // Check if we're on a YouTube video page
  function isYouTubeVideoPage() {
    return window.location.hostname.includes('youtube.com') && 
           window.location.pathname.includes('/watch');
  }

  // Create the summarize button
  function createSummarizeButton() {
    // Remove existing button if any
    const existingButton = document.getElementById('ai-summarizer-button');
    if (existingButton) {
      existingButton.remove();
    }

    const button = document.createElement('button');
    button.id = 'ai-summarizer-button';
    button.innerHTML = `
      <div class="ai-summarizer-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5,3 19,12 5,21"></polygon>
        </svg>
        <span>Summarize Video</span>
      </div>
    `;

    // Add click handler
    button.addEventListener('click', handleSummarizeClick);

    // Add to page
    document.body.appendChild(button);

    return button;
  }

  // Handle summarize button click
  function handleSummarizeClick() {
    const videoTitle = document.querySelector('h1.ytd-video-primary-info-renderer')?.textContent || 
                      document.querySelector('h1.title')?.textContent || 
                      'YouTube Video';
    const videoUrl = window.location.href;
    
    // Open the main app with the video URL
    const appUrl = `http://localhost:3000?video=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(videoTitle)}`;
    window.open(appUrl, '_blank');
  }

  // Initialize the extension
  function init() {
    if (!isYouTubeVideoPage()) return;

    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createSummarizeButton);
    } else {
      createSummarizeButton();
    }

    // Re-inject button when navigating to different videos
    const observer = new MutationObserver(() => {
      if (isYouTubeVideoPage()) {
        setTimeout(createSummarizeButton, 1000);
      }
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  }

  // Start the extension
  init();
})(); 