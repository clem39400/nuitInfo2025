import { useState, useRef, useEffect } from 'react';

/**
 * Background Music Component
 * Provides real background music with a toggle button
 */
function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio('/assets/ambient-music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    
    // Handle audio errors
    audioRef.current.onerror = (e) => {
      console.error('🎵 Audio failed to load:', e);
    };
    
    audioRef.current.oncanplaythrough = () => {
      console.log('🎵 Audio ready to play');
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleToggle = async () => {
    if (!audioRef.current) return;
    
    try {
      if (!isPlaying) {
        await audioRef.current.play();
        setIsPlaying(true);
        console.log('🎵 Music started playing');
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
        console.log('🎵 Music paused');
      }
    } catch (err) {
      console.error('🎵 Playback error:', err);
    }
  };

  const styles = {
    container: {
      position: 'fixed',
      bottom: '80px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      zIndex: 10000,
      pointerEvents: 'auto',
    },
    button: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      background: isPlaying 
        ? 'linear-gradient(145deg, #00ff88, #00cc6a)' 
        : 'linear-gradient(145deg, #2d2d44, #1a1a2e)',
      border: isPlaying ? '3px solid #00ff88' : '3px solid #555',
      color: isPlaying ? '#000' : '#00ff88',
      cursor: 'pointer',
      fontSize: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: isPlaying 
        ? '0 0 25px rgba(0, 255, 136, 0.6), 0 6px 20px rgba(0, 0, 0, 0.4)' 
        : '0 6px 20px rgba(0, 0, 0, 0.4)',
      transition: 'all 0.3s ease',
      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
      outline: 'none',
    },
    volumeContainer: {
      opacity: isHovered ? 1 : 0,
      visibility: isHovered ? 'visible' : 'hidden',
      transition: 'all 0.3s ease',
      background: 'rgba(0, 0, 0, 0.9)',
      padding: '10px 14px',
      borderRadius: '25px',
      border: '2px solid #00ff88',
    },
    slider: {
      width: '90px',
      height: '6px',
      WebkitAppearance: 'none',
      appearance: 'none',
      background: `linear-gradient(to right, #00ff88 ${volume * 100}%, #444 ${volume * 100}%)`,
      borderRadius: '3px',
      outline: 'none',
      cursor: 'pointer',
    },
    label: {
      fontSize: '11px',
      color: '#00ff88',
      fontFamily: 'monospace',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginTop: '4px',
      textShadow: isPlaying ? '0 0 10px #00ff88' : 'none',
    },
  };

  return (
    <div 
      style={styles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Volume slider */}
      <div style={styles.volumeContainer}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={styles.slider}
          aria-label="Volume control"
        />
      </div>
      
      {/* Toggle button */}
      <button
        onClick={handleToggle}
        style={styles.button}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
        aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
      >
        {isPlaying ? '🎵' : '🔇'}
      </button>
      
      {/* Status label */}
      <span style={styles.label}>
        {isPlaying ? '♪ Playing' : 'Music'}
      </span>
    </div>
  );
}

export default BackgroundMusic;
