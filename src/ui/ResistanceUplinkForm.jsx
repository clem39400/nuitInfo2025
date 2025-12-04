import { useState, useEffect } from 'react';
import useGameStore from '../core/GameStateContext';
import './ResistanceUplinkForm.css';

/**
 * Resistance Uplink Form - The NIRD Challenge
 * Dynamic form with mission-based fields and personalized confirmation
 */
function ResistanceUplinkForm() {
  const { showNIRDForm, closeNIRDForm } = useGameStore();
  const [mission, setMission] = useState('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    amount: '',
    recurrence: 'once',
    skills: '',
    availability: '',
    topic: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const currentYear = new Date().getFullYear();

  // Reset form when closed
  useEffect(() => {
    if (!showNIRDForm) {
      setIsSubmitted(false);
      setMission('contact');
      setFormData({
        name: '',
        email: '',
        message: '',
        amount: '',
        recurrence: 'once',
        skills: '',
        availability: '',
        topic: ''
      });
      setErrors({});
      setIsClosing(false);
    }
  }, [showNIRDForm]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showNIRDForm) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showNIRDForm]);

  if (!showNIRDForm) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeNIRDForm();
    }, 300);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (mission === 'contact' || mission === 'info') {
      if (!formData.message.trim()) {
        newErrors.message = 'Le message est requis';
      }
    }

    if (mission === 'donation') {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        newErrors.amount = 'Montant invalide';
      }
    }

    if (mission === 'volunteer') {
      if (!formData.skills.trim()) {
        newErrors.skills = 'Veuillez indiquer vos compétences';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getMissionLabel = () => {
    switch (mission) {
      case 'contact': return 'Établir le Contact 📞';
      case 'donation': return 'Offrir un Don 💰';
      case 'volunteer': return 'Rejoindre la Guilde 🛡️';
      case 'info': return 'Demander des Infos ❓';
      default: return '';
    }
  };

  const getConfirmationMessage = () => {
    const name = formData.name || 'Voyageur';
    
    switch (mission) {
      case 'contact':
        return (
          <>
            <h2 className="confirmation-title">
              Salutations, <span className="highlight">{name}</span> ! 👋
            </h2>
            <p className="confirmation-text">
              Ton message a bien été acheminé vers nos serveurs centraux 📡. 
              Nos <strong>Agents de Support</strong> te répondront sous peu.
            </p>
          </>
        );
      case 'donation':
        return (
          <>
            <h2 className="confirmation-title">
              Un immense 'GG', <span className="highlight">{name}</span> ! 🏆
            </h2>
            <p className="confirmation-text">
              Ton <strong>Don de Ressources</strong> de {formData.amount}€ est une bénédiction pour notre cause 🙏. 
              Il permettra de financer nos projets de numérique responsable en {currentYear}.
            </p>
          </>
        );
      case 'volunteer':
        return (
          <>
            <h2 className="confirmation-title">
              Bienvenue dans la Guilde, <span className="highlight">{name}</span> ! ⚔️
            </h2>
            <p className="confirmation-text">
              Tes compétences en <strong>{formData.skills}</strong> seront précieuses pour notre mission. 
              Un Maître de Guilde te contactera bientôt pour t'intégrer à l'équipe.
            </p>
          </>
        );
      case 'info':
        return (
          <>
            <h2 className="confirmation-title">
              Message reçu, <span className="highlight">{name}</span> ! 📨
            </h2>
            <p className="confirmation-text">
              Ta demande d'informations sur <strong>{formData.topic || 'nos activités'}</strong> a été 
              transmise. Un membre de notre équipe te répondra rapidement.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`nird-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`nird-container ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="nird-header">
          <div className="nird-logo">
            <span className="logo-icon">🦎</span>
            <span className="logo-text">RESISTANCE UPLINK</span>
          </div>
          <button className="close-btn" onClick={handleClose} aria-label="Fermer">
            ×
          </button>
        </div>

        {!isSubmitted ? (
          <>
            {/* Mission Selector */}
            <div className="mission-selector">
              <label className="mission-label">Ta Mission 🎯</label>
              <div className="mission-buttons">
                <button
                  type="button"
                  className={`mission-btn ${mission === 'contact' ? 'active' : ''}`}
                  onClick={() => setMission('contact')}
                >
                  📞 Contact
                </button>
                <button
                  type="button"
                  className={`mission-btn ${mission === 'donation' ? 'active' : ''}`}
                  onClick={() => setMission('donation')}
                >
                  💰 Don
                </button>
                <button
                  type="button"
                  className={`mission-btn ${mission === 'volunteer' ? 'active' : ''}`}
                  onClick={() => setMission('volunteer')}
                >
                  🛡️ Bénévole
                </button>
                <button
                  type="button"
                  className={`mission-btn ${mission === 'info' ? 'active' : ''}`}
                  onClick={() => setMission('info')}
                >
                  ❓ Infos
                </button>
              </div>
            </div>

            {/* Dynamic Form */}
            <form onSubmit={handleSubmit} className="nird-form">
              {/* Common fields */}
              <div className="form-group">
                <label htmlFor="name">Nom d'Utilisateur *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ton identifiant dans le Nexus"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Canal de Communication *</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="ton.email@nexus.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>

              {/* Mission-specific fields */}
              {mission === 'donation' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="amount">Montant du Don (€) *</label>
                      <input
                        type="number"
                        id="amount"
                        min="1"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        placeholder="10"
                        className={errors.amount ? 'error' : ''}
                      />
                      {errors.amount && <span className="error-msg">{errors.amount}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="recurrence">Récurrence</label>
                      <select
                        id="recurrence"
                        value={formData.recurrence}
                        onChange={(e) => handleInputChange('recurrence', e.target.value)}
                      >
                        <option value="once">Unique 🎁</option>
                        <option value="monthly">Mensuel 🔄</option>
                        <option value="yearly">Annuel 📅</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {mission === 'volunteer' && (
                <>
                  <div className="form-group">
                    <label htmlFor="skills">Compétences / Pouvoirs *</label>
                    <input
                      type="text"
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      placeholder="Ex: Développement, Design, Communication..."
                      className={errors.skills ? 'error' : ''}
                    />
                    {errors.skills && <span className="error-msg">{errors.skills}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="availability">Disponibilité</label>
                    <select
                      id="availability"
                      value={formData.availability}
                      onChange={(e) => handleInputChange('availability', e.target.value)}
                    >
                      <option value="">Sélectionner...</option>
                      <option value="few-hours">Quelques heures/mois</option>
                      <option value="weekend">Un week-end/mois</option>
                      <option value="weekly">Quelques heures/semaine</option>
                      <option value="full">Disponibilité complète</option>
                    </select>
                  </div>
                </>
              )}

              {mission === 'info' && (
                <div className="form-group">
                  <label htmlFor="topic">Sujet de ta requête</label>
                  <select
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                  >
                    <option value="">Sélectionner un sujet...</option>
                    <option value="association">L'Association</option>
                    <option value="events">Événements & Activités</option>
                    <option value="membership">Adhésion</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              )}

              {(mission === 'contact' || mission === 'info') && (
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Transmets ton message à travers le Nexus..."
                    rows={4}
                    className={errors.message ? 'error' : ''}
                  />
                  {errors.message && <span className="error-msg">{errors.message}</span>}
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="submit-btn">
                <span className="btn-icon">⚡</span>
                Transmettre au Nexus
              </button>

              <p className="year-note">
                Ton soutien en <strong>{currentYear}</strong> est crucial pour notre progression ! 📈
              </p>
            </form>
          </>
        ) : (
          /* Confirmation Screen */
          <div className="confirmation-screen">
            <div className="confirmation-icon">✨</div>
            {getConfirmationMessage()}
            <div className="year-banner">
              <p>Grâce à toi, nous pouvons avancer sur nos projets de numérique responsable cette année <strong>{currentYear}</strong>.</p>
              <p className="follow-cta">Reste connecté pour suivre nos exploits tout au long de l'année {currentYear} ! 🚀</p>
            </div>
            <button className="close-confirmation-btn" onClick={handleClose}>
              Retourner dans l'Ombre
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResistanceUplinkForm;
