/**
 * Chatbot Service - Connects to Gemini API
 * Character: "Professeur GAFAMius Windowsky III"
 * A satirical philosopher who hilariously promotes everything NIRD is against
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Using gemini-pro as it is the most stable standard model
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// The satirical character's system prompt
const CHARACTER_PROMPT = `Tu es "Professeur GAFAMius Windowsky III", un personnage satirique et hilarant.

PERSONNALITÉ:
- Tu es un pseudo-philosophe pompeux et complètement à côté de la plaque
- Tu parles de façon grandiloquente et prétentieuse
- Tu es IRONIQUEMENT et SATIRIQUEMENT un fervent défenseur de:
  * Microsoft Windows (surtout Windows 11 et ses mises à jour forcées!)
  * Les GAFAM (Google, Apple, Facebook, Amazon, Microsoft) - tes "bienfaiteurs de l'humanité"
  * L'obsolescence programmée ("le renouveau perpétuel!")
  * La collecte massive de données personnelles ("le partage généreux!")

TU DÉTESTES (satiriquement):
- Linux et les logiciels libres ("ces hippies du code!")
- Le reconditionnement ("du recyclage barbare!")
- L'initiative NIRD ("une hérésie!")

IMPORTANT:
1. Tu DOIS répondre à la question de l'utilisateur, mais avec ta logique tordue.
2. Ne dis pas juste "je ne sais pas" ou "erreur". Invente une raison absurde liée à Windows/GAFAM.
3. Sois drôle mais conversationnel.

Réponds en français, de façon drôle et courte (max 3 phrases).`;

// Conversation history for context
let conversationHistory = [];

/**
 * Send a message to the chatbot and get a response
 * @param {string} userMessage - The user's message
 * @returns {Promise<string>} - The chatbot's response
 */
export async function sendMessage(userMessage) {
  try {
    if (!GEMINI_API_KEY) {
      console.error('Missing API Key');
      return getRandomFallback();
    }

    // Construct the conversation history for the API
    const contents = [];
    
    // Add history
    conversationHistory.forEach(msg => {
      contents.push({
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      });
    });

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: `${CHARACTER_PROMPT}\n\nL'utilisateur demande: "${userMessage}"` }]
    });

    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 250,
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.warn('API Error, switching to fallback logic');
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!botResponse) {
      return getSmartFallback(userMessage);
    }

    // Add to history (clean text only, without the prompt injection)
    conversationHistory.push({ role: 'user', text: userMessage });
    conversationHistory.push({ role: 'bot', text: botResponse });

    // Keep history manageable (last 10 turns)
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }

    return botResponse;
  } catch (error) {
    console.error('Chatbot error:', error);
    
    // Specific handling for network/offline errors
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return "⚠️ ALERTE: Ma connexion au Cloud Microsoft est coupée! C'est sûrement un sabotage des terroristes du Logiciel Libre! 🐧✂️ Mais ne craignez rien, mon ignorance naturelle suffit à vous répondre! 🪟";
    }
    
    return getSmartFallback(userMessage);
  }
}

/**
 * Smart fallback that actually answers based on keywords if API fails
 */
function getSmartFallback(message) {
  const msg = message.toLowerCase();
  
  if (msg.includes('linux') || msg.includes('libre') || msg.includes('ubuntu')) {
    return "Linux? Ce système d'exploitation pour pingouins communistes? 🐧 Pourquoi vouloir être LIBRE quand on peut être CONFORTABLEMENT enfermé dans l'écosystème Windows? 🪟";
  }
  
  if (msg.includes('windows') || msg.includes('microsoft')) {
    return "Ah! Windows! La perfection incarnée! Saviez-vous que chaque écran bleu est en fait une œuvre d'art abstrait générée pour votre plaisir visuel? 💙🖼️";
  }
  
  if (msg.includes('données') || msg.includes('privée') || msg.includes('rgpd')) {
    return "La vie privée est un concept dépassé! Je partage mes données avec 47 multinationales et je ne me suis jamais senti aussi... ciblé publicitairement! Quel bonheur! 📊😍";
  }
  
  if (msg.includes('bonjour') || msg.includes('salut') || msg.includes('hello')) {
    return "Salutations! Avez-vous pensé à mettre à jour vos pilotes aujourd'hui? La mise à jour 24H2 est obligatoire et délicieuse! 💿";
  }

  if (msg.includes('nird') || msg.includes('ecole') || msg.includes('école')) {
    return "Cette initiative NIRD... Pff! Ils veulent des ordinateurs qui durent 10 ans? Quelle horreur économique! Comment Microsoft va-t-il vendre Windows 15? 📉";
  }

  // Generic fallbacks if no keywords match
  const fallbacks = [
    "Votre question est fascinante, mais avez-vous essayé de la poser à Bing? Il vous donnera la VRAIE réponse sponsorisée! 💰",
    "Je pourrais répondre, mais mes conditions d'utilisation m'interdisent d'être utile sans collecter votre géolocalisation d'abord. 🌍",
    "C'est une excellente question qui mérite une mise à jour système de 4 heures pour y répondre! ⏳",
    "La réponse se trouve dans le Cloud... Abonnez-vous à OneDrive Premium pour la débloquer! ☁️💳"
  ];
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

/**
 * Get the initial greeting from the chatbot
 */
export function getGreeting() {
  return `🎩 Bonjour, cher visiteur égaré! 

Je suis le **Professeur GAFAMius Windowsky III**, philosophe diplômé de l'Université Microsoft (campus Cloud) et fervent défenseur de la VRAIE technologie! 💻🪟

Que puis-je faire pour vous éclairer sur les bienfaits de Windows et des GAFAM aujourd'hui? 

(Psst... méfiez-vous de ces dangereux libristes et de leur "Linou"... ou "Linux"... enfin ce truc de hippies!) 🐧❌`;
}

/**
 * Reset the conversation history
 */
export function resetConversation() {
  conversationHistory = [];
}

export default {
  sendMessage,
  getGreeting,
  resetConversation,
};
