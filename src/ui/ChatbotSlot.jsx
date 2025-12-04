/**
 * ChatbotSlot - Placeholder component for chatbot team
 * 
 * INTEGRATION DOCUMENTATION FOR CHATBOT DEVELOPERS:
 * 
 * Props Interface:
 * @param {Function} onClose - Called when chatbot should close
 * @param {Function} onSnakeCommand - Called when user types "SUDO SNAKE" or "KILL PROCESS"
 * @param {boolean} isActive - Whether chatbot is currently active
 * 
 * Usage:
 * - This component should render the chatbot UI overlay
 * - Position: Fixed overlay on top of 3D scene
 * - When user types the magic command, call onSnakeCommand()
 * - When chatbot is defeated, call onClose()
 * 
 * Example:
 * <ChatbotSlot
 *   isActive={true}
 *   onSnakeCommand={() => console.log('Launch snake game!')}
 *   onClose={() => console.log('Chatbot defeated')}
 * />
 */
function ChatbotSlot({ onClose, onSnakeCommand, isActive }) {
  if (!isActive) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#1a1a2e',
        border: '2px solid #00ff88',
        padding: '20px',
        borderRadius: '8px',
        color: '#00ff88',
        fontFamily: 'monospace',
      }}>
        <h2>CHATBOT PLACEHOLDER</h2>
        <p>Replace this component with your chatbot implementation</p>
        <button
          onClick={onSnakeCommand}
          style={{
            background: '#00ff88',
            color: '#000',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Trigger Snake Game (Debug)
        </button>
      </div>
    </div>
  );
}

export default ChatbotSlot;
