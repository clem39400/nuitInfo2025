import { useState, useRef, useEffect } from 'react';
import { sendMessage, getGreeting, resetConversation } from '../services/ChatbotService';

/**
 * Chatbot UI Component
 * Features the satirical "Professeur GAFAMius Windowsky III"
 */
function Chatbot({ isOpen, onClose, onSnakeGameStart }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSnakeButton, setShowSnakeButton] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'bot',
        content: getGreeting(),
      }]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check for SNAKE keyword to show Snake game - ONLY when user types exactly "snake"
  const checkForSnakeCommand = (userText) => {
    const text = userText.toLowerCase().trim();
    if (text === 'snake' || text.includes('snake')) {
      setShowSnakeButton(true);
      return true;
    }
    return false;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Check if user typed SNAKE
    if (checkForSnakeCommand(userMessage)) {
      // Add bot response about snake challenge
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "🐍 Ah! Vous voulez jouer au SNAKE? Très bien! Le Professeur GAFAMius accepte ce défi ridicule! Cliquez sur le bouton pour affronter ma sagesse! 🎮" 
      }]);
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await sendMessage(userMessage);
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "Erreur système! Mon Windows a encore crashé! C'est un SIGNE de sa COMPLEXITÉ AVANCÉE! 🪟💥" 
      }]);
    }

    setIsLoading(false);
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
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.avatar}>🎩</div>
          <div style={styles.headerInfo}>
            <h3 style={styles.name}>Prof. GAFAMius Windowsky III</h3>
            <span style={styles.status}>
              {isLoading ? '💭 Médite sur Windows...' : '🟢 En ligne (surveillé par 47 cookies)'}
            </span>
          </div>
          <button style={styles.closeButton} onClick={handleClose}>✕</button>
        </div>

        {/* Messages */}
        <div style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                ...(msg.role === 'user' ? styles.userMessage : styles.botMessage),
              }}
            >
              {msg.role === 'bot' && <span style={styles.botAvatar}>🎩</span>}
              <div style={styles.messageContent}>
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} style={styles.messageLine}>{line}</p>
                ))}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div style={{ ...styles.message, ...styles.botMessage }}>
              <span style={styles.botAvatar}>🎩</span>
              <div style={styles.typing}>
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}

          {/* Snake Game Challenge Button */}
          {showSnakeButton && (
            <div style={styles.snakeChallenge}>
              <p style={styles.challengeText}>
                🐍 Vous osez défier la sagesse de Windows? 
                Prouvez votre valeur au jeu du SERPENT!
              </p>
              <button 
                style={styles.snakeButton}
                onClick={() => onSnakeGameStart?.()}
              >
                🎮 Affronter le Professeur au Snake!
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez une question au Professeur..."
            style={styles.input}
            disabled={isLoading}
          />
          <button 
            style={styles.sendButton} 
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
          >
            📤
          </button>
        </div>

        {/* Satirical Footer */}
        <div style={styles.footer}>
          ⚠️ Ceci est de la satire - Vive le numérique libre! 🐧
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  container: {
    width: '450px',
    maxHeight: '80vh',
    backgroundColor: '#1a1a2e',
    borderRadius: '16px',
    border: '2px solid #00ff88',
    boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    background: 'linear-gradient(135deg, #0078d4 0%, #00a2ff 100%)',
    borderBottom: '2px solid #00ff88',
  },
  avatar: {
    fontSize: '40px',
    marginRight: '12px',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    margin: 0,
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  status: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: '#fff',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background 0.2s',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '400px',
  },
  message: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  userMessage: {
    flexDirection: 'row-reverse',
  },
  botMessage: {
    flexDirection: 'row',
  },
  botAvatar: {
    fontSize: '24px',
    flexShrink: 0,
  },
  messageContent: {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  messageLine: {
    margin: '4px 0',
  },
  typing: {
    display: 'flex',
    gap: '4px',
    padding: '12px 16px',
    background: 'rgba(0, 120, 212, 0.3)',
    borderRadius: '16px',
  },
  inputContainer: {
    display: 'flex',
    padding: '12px',
    gap: '8px',
    borderTop: '1px solid rgba(0, 255, 136, 0.3)',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '24px',
    border: '1px solid #00ff88',
    background: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  sendButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
    cursor: 'pointer',
    fontSize: '20px',
    transition: 'transform 0.2s',
  },
  snakeChallenge: {
    background: 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)',
    padding: '16px',
    borderRadius: '12px',
    textAlign: 'center',
    animation: 'pulse 2s infinite',
  },
  challengeText: {
    color: '#fff',
    margin: '0 0 12px 0',
    fontWeight: 'bold',
  },
  snakeButton: {
    background: '#fff',
    color: '#ff4444',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
  },
  footer: {
    padding: '8px',
    textAlign: 'center',
    fontSize: '11px',
    color: '#888',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
};

// Add user message styles
styles.messageContent = {
  ...styles.messageContent,
};

// Override based on message type using inline styles in component

export default Chatbot;
