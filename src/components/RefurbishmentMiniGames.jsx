import { useState } from 'react';
import useRefurbishmentStore, { REFURBISHMENT_STATIONS } from '../core/RefurbishmentGameState';
import './RefurbishmentMiniGames.css';

/**
 * Master Mini-Game Container
 * Displays the appropriate mini-game based on active station
 */
export function RefurbishmentMiniGameOverlay() {
  const { activeMiniGame, closeMiniGame, completeStation, getCurrentStation } = useRefurbishmentStore();
  
  if (!activeMiniGame) return null;
  
  const currentStation = getCurrentStation();
  
  const handleComplete = (score) => {
    completeStation(activeMiniGame, score);
  };
  
  const renderMiniGame = () => {
    switch (activeMiniGame) {
      case 'collect':
        return <CollectMiniGame onComplete={handleComplete} onClose={closeMiniGame} />;
      case 'diagnose':
        return <DiagnoseMiniGame onComplete={handleComplete} onClose={closeMiniGame} />;
      case 'datawipe':
        return <DataWipeMiniGame onComplete={handleComplete} onClose={closeMiniGame} />;
      case 'repair':
        return <RepairMiniGame onComplete={handleComplete} onClose={closeMiniGame} />;
      case 'install':
        return <InstallMiniGame onComplete={handleComplete} onClose={closeMiniGame} />;
      case 'redistribute':
        return <RedistributeMiniGame onComplete={handleComplete} onClose={closeMiniGame} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="minigame-overlay">
      <div className="minigame-container" style={{ '--accent-color': currentStation?.color }}>
        <div className="minigame-header">
          <span className="minigame-icon">{currentStation?.icon}</span>
          <h2>{currentStation?.name}</h2>
          <button className="minigame-close" onClick={closeMiniGame}>✕</button>
        </div>
        <p className="minigame-description">{currentStation?.description}</p>
        {renderMiniGame()}
      </div>
    </div>
  );
}

/**
 * Mini-game 1: Collect - Drag sources to truck
 */
function CollectMiniGame({ onComplete, onClose }) {
  const [collected, setCollected] = useState([]);
  const sources = [
    { id: 'school', name: 'École', emoji: '🏫' },
    { id: 'office', name: 'Entreprise', emoji: '🏢' },
    { id: 'home', name: 'Particulier', emoji: '🏠' },
    { id: 'admin', name: 'Administration', emoji: '🏛️' },
  ];
  
  const handleCollect = (id) => {
    if (!collected.includes(id)) {
      const newCollected = [...collected, id];
      setCollected(newCollected);
      if (newCollected.length === sources.length) {
        setTimeout(() => onComplete(100), 500);
      }
    }
  };
  
  return (
    <div className="minigame-content collect-game">
      <p className="instruction">Cliquez sur toutes les sources de PC usagés :</p>
      <div className="sources-grid">
        {sources.map(source => (
          <button
            key={source.id}
            className={`source-btn ${collected.includes(source.id) ? 'collected' : ''}`}
            onClick={() => handleCollect(source.id)}
            disabled={collected.includes(source.id)}
          >
            <span className="source-emoji">{source.emoji}</span>
            <span className="source-name">{source.name}</span>
            {collected.includes(source.id) && <span className="checkmark">✓</span>}
          </button>
        ))}
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(collected.length / sources.length) * 100}%` }} />
      </div>
      <p className="counter">{collected.length} / {sources.length} collectés</p>
    </div>
  );
}

/**
 * Mini-game 2: Diagnose - Find the broken components
 */
function DiagnoseMiniGame({ onComplete, onClose }) {
  const [tested, setTested] = useState({});
  const components = [
    { id: 'ram', name: 'RAM', status: 'ok', emoji: '💾' },
    { id: 'disk', name: 'Disque dur', status: 'broken', emoji: '💿' },
    { id: 'screen', name: 'Écran', status: 'ok', emoji: '🖥️' },
    { id: 'keyboard', name: 'Clavier', status: 'broken', emoji: '⌨️' },
    { id: 'battery', name: 'Batterie', status: 'ok', emoji: '🔋' },
  ];
  
  const handleTest = (comp) => {
    if (!tested[comp.id]) {
      setTested(prev => ({ ...prev, [comp.id]: comp.status }));
      
      const newTested = { ...tested, [comp.id]: comp.status };
      if (Object.keys(newTested).length === components.length) {
        setTimeout(() => onComplete(100), 800);
      }
    }
  };
  
  const allTested = Object.keys(tested).length === components.length;
  
  return (
    <div className="minigame-content diagnose-game">
      <p className="instruction">Testez tous les composants pour identifier les pannes :</p>
      <div className="components-list">
        {components.map(comp => (
          <div key={comp.id} className="component-row">
            <span className="comp-emoji">{comp.emoji}</span>
            <span className="comp-name">{comp.name}</span>
            {tested[comp.id] ? (
              <span className={`status ${tested[comp.id]}`}>
                {tested[comp.id] === 'ok' ? '✓ OK' : '✗ PANNE'}
              </span>
            ) : (
              <button className="test-btn" onClick={() => handleTest(comp)}>
                🔍 Tester
              </button>
            )}
          </div>
        ))}
      </div>
      {allTested && (
        <div className="result-summary">
          <p>🔧 Composants à remplacer : Disque dur, Clavier</p>
        </div>
      )}
    </div>
  );
}

/**
 * Mini-game 3: Data Wipe - Memory sequence game
 */
function DataWipeMiniGame({ onComplete, onClose }) {
  const [stage, setStage] = useState(0);
  const [input, setInput] = useState('');
  
  const stages = [
    { question: 'Pourquoi effacer les données ?', answer: 'vie privée', hint: 'Protection de la ___' },
    { question: 'Quel outil pour effacer ?', answer: 'dban', hint: 'D___ (Darik\'s Boot and Nuke)' },
    { question: 'Combien de passes minimum ?', answer: '3', hint: 'Un chiffre entre 1 et 5' },
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.toLowerCase().includes(stages[stage].answer.toLowerCase())) {
      if (stage < stages.length - 1) {
        setStage(stage + 1);
        setInput('');
      } else {
        onComplete(100);
      }
    }
  };
  
  return (
    <div className="minigame-content datawipe-game">
      <div className="wipe-progress">
        {stages.map((_, i) => (
          <div key={i} className={`wipe-step ${i < stage ? 'done' : ''} ${i === stage ? 'current' : ''}`}>
            {i < stage ? '🔐' : '🔓'}
          </div>
        ))}
      </div>
      <div className="question-box">
        <p className="question">{stages[stage].question}</p>
        <p className="hint">💡 Indice : {stages[stage].hint}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Votre réponse..."
            autoFocus
          />
          <button type="submit">Valider</button>
        </form>
      </div>
    </div>
  );
}

/**
 * Mini-game 4: Repair - Match components to slots
 */
function RepairMiniGame({ onComplete, onClose }) {
  const [placed, setPlaced] = useState([]);
  const parts = [
    { id: 'ram', slot: 'memory', emoji: '💾', name: 'RAM' },
    { id: 'ssd', slot: 'storage', emoji: '📀', name: 'SSD' },
    { id: 'fan', slot: 'cooling', emoji: '🌀', name: 'Ventilateur' },
  ];
  
  const handlePlace = (partId) => {
    if (!placed.includes(partId)) {
      const newPlaced = [...placed, partId];
      setPlaced(newPlaced);
      if (newPlaced.length === parts.length) {
        setTimeout(() => onComplete(100), 500);
      }
    }
  };
  
  return (
    <div className="minigame-content repair-game">
      <p className="instruction">Installez les composants de remplacement :</p>
      <div className="motherboard">
        <div className="mb-graphic">🖥️ CARTE MÈRE</div>
        <div className="slots">
          {parts.map(part => (
            <div 
              key={part.id}
              className={`slot ${placed.includes(part.id) ? 'filled' : ''}`}
              onClick={() => handlePlace(part.id)}
            >
              {placed.includes(part.id) ? (
                <span className="placed-part">{part.emoji} {part.name}</span>
              ) : (
                <span className="empty-slot">[ {part.name} ]</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="parts-tray">
        {parts.filter(p => !placed.includes(p.id)).map(part => (
          <button key={part.id} className="part-btn" onClick={() => handlePlace(part.id)}>
            {part.emoji} {part.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Mini-game 5: Install Linux - Terminal commands
 */
function InstallMiniGame({ onComplete, onClose }) {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  
  const commands = [
    { prompt: 'Démarrer l\'installation', command: 'install', hint: 'Tapez "install"' },
    { prompt: 'Choisir la langue', command: 'fr', hint: 'Code langue française' },
    { prompt: 'Formater le disque', command: 'format', hint: 'Tapez "format"' },
    { prompt: 'Installer GRUB', command: 'grub', hint: 'Nom du bootloader' },
  ];
  
  const handleCommand = (e) => {
    e.preventDefault();
    if (input.toLowerCase() === commands[step].command) {
      if (step < commands.length - 1) {
        setStep(step + 1);
        setInput('');
      } else {
        onComplete(100);
      }
    }
  };
  
  return (
    <div className="minigame-content install-game">
      <div className="terminal">
        <div className="terminal-header">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
          <span className="title">🐧 Installation Linux</span>
        </div>
        <div className="terminal-body">
          {commands.slice(0, step + 1).map((cmd, i) => (
            <div key={i} className="terminal-line">
              <span className="prompt">$</span>
              {i < step ? (
                <span className="executed">{cmd.command} ✓</span>
              ) : (
                <form onSubmit={handleCommand}>
                  <span className="current-task">{cmd.prompt}:</span>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={cmd.hint}
                    autoFocus
                  />
                </form>
              )}
            </div>
          ))}
          <div className="progress-indicator">
            Progression : {Math.round((step / commands.length) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Mini-game 6: Redistribute - Choose recipients
 */
function RedistributeMiniGame({ onComplete, onClose }) {
  const [distributed, setDistributed] = useState([]);
  const recipients = [
    { id: 'family', name: 'Famille en difficulté', emoji: '👨‍👩‍👧', impact: '+30 points solidarité' },
    { id: 'school', name: 'École du quartier', emoji: '🏫', impact: '+30 points éducation' },
    { id: 'student', name: 'Étudiant sans moyens', emoji: '🎓', impact: '+20 points inclusion' },
    { id: 'association', name: 'Association locale', emoji: '🤝', impact: '+20 points communauté' },
  ];
  
  const handleDistribute = (id) => {
    if (!distributed.includes(id)) {
      const newDistributed = [...distributed, id];
      setDistributed(newDistributed);
      if (newDistributed.length >= 3) {
        setTimeout(() => onComplete(100), 800);
      }
    }
  };
  
  return (
    <div className="minigame-content redistribute-game">
      <p className="instruction">Choisissez au moins 3 bénéficiaires pour vos PC reconditionnés :</p>
      <div className="recipients-grid">
        {recipients.map(r => (
          <button
            key={r.id}
            className={`recipient-btn ${distributed.includes(r.id) ? 'selected' : ''}`}
            onClick={() => handleDistribute(r.id)}
          >
            <span className="recipient-emoji">{r.emoji}</span>
            <span className="recipient-name">{r.name}</span>
            <span className="recipient-impact">{r.impact}</span>
          </button>
        ))}
      </div>
      <div className="distribution-count">
        🎁 {distributed.length} / 3 PC distribués
      </div>
    </div>
  );
}

export default RefurbishmentMiniGameOverlay;
