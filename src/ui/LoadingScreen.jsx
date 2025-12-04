import { useState, useEffect } from 'react';

/**
 * Loading Screen - Displays while assets are loading
 */
function LoadingScreen({ isLoading }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      // Simulate loading progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className={`loading-screen ${!isLoading ? 'fade-out' : ''}`}>
      <div className="loading-spinner"></div>
      <div className="loading-text">Initializing System</div>
      <div className="loading-progress">{progress}%</div>
    </div>
  );
}

export default LoadingScreen;
