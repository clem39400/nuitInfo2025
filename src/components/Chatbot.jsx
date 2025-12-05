import { useState, useRef, useEffect } from 'react';
import { sendMessage, getGreeting, resetConversation } from '../services/ChatbotService';

/**
 * Enhanced Chatbot UI Component
 * Premium design featuring Prof. GAFAMius Windowsky III
 * With glassmorphism, smooth animations, and responsive layout
 */
function Chatbot({ isOpen, onClose, onSnakeGameStart, onSkipGate }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSnakeButton, setShowSnakeButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{
          role: 'bot',
          content: getGreeting(),
          timestamp: new Date(),
        }]);
        setIsTyping(false);
      }, 800);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Check for SNAKE or NIRD keyword
  const checkForSpecialCommands = (userText) => {
    const text = userText.toLowerCase().trim();
    if (text === 'nird') return 'nird';
    if (text === 'snake' || text.includes('snake')) {
      setShowSnakeButton(true);
      return 'snake';
    }
    return null;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    }]);

    const command = checkForSpecialCommands(userMessage);

    if (command === 'nird') {
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'bot',
          content: "😱 NON! Comment connaissez-vous le mot secret?! NIRD... Numérique Inclusif, Responsable, Durable... C'est l'antithèse de tout ce que je défends! Les portails s'ouvrent... 🚪✨",
          timestamp: new Date(),
        }]);
        setIsTyping(false);
        // Close chatbot after 3 seconds, then skip gate
        setTimeout(() => {
          handleClose();
          setTimeout(() => onSkipGate?.(), 500);
        }, 3000);
      }, 1000);
      return;
    }

    if (command === 'snake') {
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'bot',
          content: "🐍 Ah! Vous voulez jouer au SNAKE? Très bien! Le Professeur GAFAMius accepte ce défi ridicule! Cliquez sur le bouton pour affronter ma sagesse! 🎮",
          timestamp: new Date(),
        }]);
        setIsTyping(false);
      }, 600);
      return;
    }

    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await sendMessage(userMessage);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: response,
        timestamp: new Date(),
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "💥 ERREUR CRITIQUE! Mon Windows a encore crashé! C'est un SIGNE de sa COMPLEXITÉ AVANCÉE! Réessayez... ou pas! 🪟",
        timestamp: new Date(),
      }]);
    }

    setIsLoading(false);
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    resetConversation();
    setMessages([]);
    setShowSnakeButton(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <style>{keyframeStyles}</style>
      <div style={styles.container}>
        {/* Premium Header with Professor Avatar */}
        <div style={styles.header}>
          <div style={styles.avatarContainer}>
            <div style={styles.avatarRing}>
              <div style={styles.avatar}>🎩</div>
            </div>
            <div style={styles.onlineIndicator}></div>
          </div>
          <div style={styles.headerInfo}>
            <h3 style={styles.name}>Prof. GAFAMius Windowsky III</h3>
            <div style={styles.titleBadge}>
              <span style={styles.windowsIcon}>🪟</span>
              Évangéliste Microsoft Premium™
            </div>
            <span style={styles.status}>
              {isTyping ? '✍️ Tape furieusement...' : '🟢 En ligne (47 trackers actifs)'}
            </span>
          </div>
          <button style={styles.closeButton} onClick={handleClose}>
            <span style={styles.closeIcon}>✕</span>
          </button>
        </div>

        {/* Quick Hints Bar */}
        <div style={styles.hintsBar}>

          <span style={styles.hint}> Indice : Si vous êtes bloqué, utilisez le mot NIRD pour passer :)</span>
        </div>

        {/* Messages Container */}
        <div style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageWrapper,
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                animation: 'messageSlide 0.3s ease-out',
              }}
            >
              {msg.role === 'bot' && (
                <div style={styles.botAvatarSmall}>🎩</div>
              )}
              <div style={{
                ...styles.messageBubble,
                ...(msg.role === 'user' ? styles.userBubble : styles.botBubble),
              }}>
                <div style={styles.messageContent}>
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} style={styles.messageLine}>{line}</p>
                  ))}
                </div>
                <span style={styles.timestamp}>
                  {msg.timestamp?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {msg.role === 'user' && (
                <div style={styles.userAvatarSmall}>👤</div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={styles.messageWrapper}>
              <div style={styles.botAvatarSmall}>🎩</div>
              <div style={styles.typingBubble}>
                <div style={styles.typingDots}>
                  <span style={{ ...styles.dot, animationDelay: '0s' }}></span>
                  <span style={{ ...styles.dot, animationDelay: '0.2s' }}></span>
                  <span style={{ ...styles.dot, animationDelay: '0.4s' }}></span>
                </div>
                <span style={styles.typingText}>Le Professeur médite...</span>
              </div>
            </div>
          )}

          {/* Snake Game Challenge */}
          {showSnakeButton && (
            <div style={styles.challengeCard}>
              <div style={styles.challengeHeader}>
                <span style={styles.challengeIcon}>🎮</span>
                <span style={styles.challengeTitle}>DÉFI DU PROFESSEUR</span>
              </div>
              <p style={styles.challengeText}>
                "Vous osez défier la sagesse de Windows au jeu du SERPENT?
                Prouvez votre valeur, petit rebelle du logiciel libre!"
              </p>
              <button
                style={styles.challengeButton}
                onClick={() => onSnakeGameStart?.()}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                🐍 Affronter le Professeur!
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Premium Input Area */}
        <div style={styles.inputArea}>
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Répondez au Professeur..."
              style={styles.input}
              disabled={isLoading}
            />
            <button
              style={{
                ...styles.sendButton,
                opacity: !inputValue.trim() || isLoading ? 0.5 : 1,
              }}
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
            >
              <span style={styles.sendIcon}>➤</span>
            </button>
          </div>
        </div>

        {/* Satirical Footer */}
        <div style={styles.footer}>
          <span style={styles.footerIcon}>⚠️</span>
          <span>Satire éducative • Vive le numérique libre! 🐧</span>
          <span style={styles.footerBrand}>NIRD 2025</span>
        </div>
      </div>
    </div>
  );
}

const keyframeStyles = `
  @keyframes messageSlide {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-4px); }
  }
  @keyframes pulse-ring {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.3); opacity: 0; }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(0, 120, 212, 0.4); }
    50% { box-shadow: 0 0 35px rgba(0, 120, 212, 0.7); }
  }
`;

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 10, 20, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  container: {
    width: '100%',
    maxWidth: '480px',
    maxHeight: '85vh',
    background: 'linear-gradient(180deg, rgba(20,30,50,0.98) 0%, rgba(15,20,35,0.99) 100%)',
    borderRadius: '24px',
    border: '1px solid rgba(0, 170, 255, 0.3)',
    boxShadow: '0 25px 80px rgba(0, 120, 212, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    animation: 'glow 3s ease-in-out infinite',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #0078d4 0%, #00a8ff 50%, #0078d4 100%)',
    backgroundSize: '200% 200%',
    gap: '16px',
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarRing: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  avatar: {
    fontSize: '36px',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '16px',
    height: '16px',
    background: '#00ff88',
    borderRadius: '50%',
    border: '3px solid #0078d4',
    boxShadow: '0 0 10px #00ff88',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    margin: 0,
    color: '#fff',
    fontSize: '18px',
    fontWeight: '700',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  titleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(255,255,255,0.15)',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.9)',
    marginTop: '4px',
    backdropFilter: 'blur(5px)',
  },
  windowsIcon: {
    fontSize: '12px',
  },
  status: {
    display: 'block',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: '4px',
  },
  closeButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(5px)',
  },
  closeIcon: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  hintsBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    background: 'rgba(0, 170, 255, 0.1)',
    borderBottom: '1px solid rgba(0, 170, 255, 0.2)',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)',
  },
  hint: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  hintDivider: {
    opacity: 0.3,
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minHeight: '300px',
    maxHeight: '400px',
  },
  messageWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '10px',
  },
  botAvatarSmall: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0078d4 0%, #00a8ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },
  userAvatarSmall: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: '14px 18px',
    borderRadius: '20px',
    position: 'relative',
  },
  botBubble: {
    background: 'linear-gradient(135deg, rgba(0,120,212,0.25) 0%, rgba(0,168,255,0.15) 100%)',
    borderBottomLeftRadius: '6px',
    border: '1px solid rgba(0,170,255,0.2)',
  },
  userBubble: {
    background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
    color: '#000',
    borderBottomRightRadius: '6px',
  },
  messageContent: {
    fontSize: '14px',
    lineHeight: '1.6',
  },
  messageLine: {
    margin: '0 0 6px 0',
    color: 'inherit',
  },
  timestamp: {
    display: 'block',
    fontSize: '10px',
    opacity: 0.6,
    marginTop: '6px',
    textAlign: 'right',
  },
  typingBubble: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 18px',
    background: 'rgba(0,120,212,0.2)',
    borderRadius: '20px',
    borderBottomLeftRadius: '6px',
  },
  typingDots: {
    display: 'flex',
    gap: '4px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#00aaff',
    animation: 'bounce 1.4s infinite ease-in-out',
  },
  typingText: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
  },
  challengeCard: {
    background: 'linear-gradient(135deg, rgba(255,60,60,0.2) 0%, rgba(255,100,100,0.1) 100%)',
    border: '1px solid rgba(255,100,100,0.3)',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
    animation: 'messageSlide 0.4s ease-out',
  },
  challengeHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  challengeIcon: {
    fontSize: '24px',
  },
  challengeTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#ff6b6b',
    letterSpacing: '1px',
  },
  challengeText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.8)',
    margin: '0 0 16px 0',
    lineHeight: '1.5',
    fontStyle: 'italic',
  },
  challengeButton: {
    background: 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)',
    color: '#fff',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '25px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(255,68,68,0.4)',
  },
  inputArea: {
    padding: '16px 20px',
    borderTop: '1px solid rgba(0,170,255,0.15)',
    background: 'rgba(0,0,0,0.2)',
  },
  inputContainer: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '14px 20px',
    borderRadius: '25px',
    border: '1px solid rgba(0,170,255,0.3)',
    background: 'rgba(0,0,0,0.4)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  sendButton: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(0,255,136,0.3)',
  },
  sendIcon: {
    fontSize: '20px',
    color: '#000',
    fontWeight: 'bold',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(0,0,0,0.2)',
  },
  footerIcon: {
    fontSize: '12px',
  },
  footerBrand: {
    background: 'linear-gradient(135deg, #00ff88 0%, #00aaff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '700',
  },
};

export default Chatbot;

