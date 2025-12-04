import { useState } from 'react';
import useGameStore from '../core/GameStateContext';

/**
 * IntroOverlay - Compact intro panel explaining NIRD values
 * Shows on Phase 1 to guide users on what to do
 */
function IntroOverlay({ onDismiss }) {
  const [isVisible, setIsVisible] = useState(true);
  const { currentPhase } = useGameStore();

  // Only show in gate phase
  if (currentPhase !== 'gate' || !isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <div style={styles.container}>
      {/* NIRD Header */}
      <div style={styles.header}>
        <span style={styles.logo}>🐧</span>
        <div>
          <h2 style={styles.title}>Démarche NIRD</h2>
          <p style={styles.subtitle}>Numérique Inclusif, Responsable, Durable</p>
        </div>
      </div>

      {/* Three Pillars */}
      <div style={styles.pillars}>
        <div style={styles.pillar}>
          <span style={styles.pillarIcon}>🤝</span>
          <span style={styles.pillarText}>Inclusif</span>
        </div>
        <div style={styles.pillar}>
          <span style={styles.pillarIcon}>🛡️</span>
          <span style={styles.pillarText}>Responsable</span>
        </div>
        <div style={styles.pillar}>
          <span style={styles.pillarIcon}>🌱</span>
          <span style={styles.pillarText}>Durable</span>
        </div>
      </div>

      {/* Story Context */}
      <div style={styles.story}>
        <p style={styles.storyText}>
          <strong>⚠️ L'école est verrouillée !</strong><br />
          Un gardien IA, partisan du numérique propriétaire, bloque l'entrée.<br />
          <em>Parlez-lui pour découvrir sa faiblesse...</em>
        </p>
      </div>

      {/* Instructions - CRYPTIC CLUES */}
      <div style={styles.instructions}>
        <div style={styles.instruction}>
          <span style={styles.instructionIcon}>💬</span>
          <span>Cliquez sur l'hologramme bleu pour parler au gardien</span>
        </div>
        <div style={styles.instruction}>
          <span style={styles.instructionIcon}>🎮</span>
          <span><em>Indice: Un reptile qui slalome dans les classiques d'arcade pourrait être votre allié...</em></span>
        </div>
        <div style={styles.instruction}>
          <span style={styles.instructionIcon}>🔑</span>
          <span><em>Indice: 4 lettres sacrées du numérique responsable ouvrent toutes les portes...</em></span>
        </div>
      </div>

      {/* Dismiss Button */}
      <button style={styles.button} onClick={handleDismiss}>
        Compris ! Entrer dans l'aventure 🚀
      </button>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '420px',
    maxWidth: '90vw',
    background: 'linear-gradient(135deg, rgba(10, 10, 20, 0.95) 0%, rgba(20, 30, 50, 0.95) 100%)',
    borderRadius: '16px',
    border: '2px solid #00ff88',
    boxShadow: '0 0 40px rgba(0, 255, 136, 0.3), inset 0 0 60px rgba(0, 255, 136, 0.05)',
    padding: '20px',
    zIndex: 1500,
    animation: 'slideIn 0.5s ease-out',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(0, 255, 136, 0.3)',
  },
  logo: {
    fontSize: '36px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    color: '#00ff88',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  subtitle: {
    margin: 0,
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  pillars: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '16px',
  },
  pillar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  pillarIcon: {
    fontSize: '24px',
  },
  pillarText: {
    fontSize: '11px',
    color: '#00ff88',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  story: {
    background: 'rgba(255, 100, 100, 0.1)',
    border: '1px solid rgba(255, 100, 100, 0.3)',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
  },
  storyText: {
    margin: 0,
    fontSize: '13px',
    color: '#fff',
    lineHeight: '1.5',
  },
  instructions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
  instruction: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  instructionIcon: {
    fontSize: '16px',
  },
  code: {
    background: 'rgba(0, 255, 136, 0.2)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    color: '#00ff88',
  },
  button: {
    width: '100%',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#000',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
};

export default IntroOverlay;
