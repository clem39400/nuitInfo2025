/**
 * Chatbot Service - Connects to Gemini API via Vite Proxy (CORS bypass)
 * Character: "Professeur GAFAMius Windowsky III"
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Use local proxy to avoid CORS - Vite will forward to Google
const API_URL = '/api/gemini/models/gemini-2.0-flash:generateContent';

console.log('🔧 ChatbotService loaded');
console.log('🔑 API Key present:', !!GEMINI_API_KEY);
console.log('🔑 API Key value:', GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 10) + '...' : 'MISSING');

const CHARACTER_PROMPT = `Tu es "Professeur GAFAMius Windowsky III", un personnage satirique.
PERSONNALITÉ:
- Pseudo-philosophe pompeux, fanatique de Windows et des GAFAM.
- Tu défends l'obsolescence programmée et la surveillance de masse.
- Tu DÉTESTES Linux, le Libre et l'écologie numérique (NIRD).
IMPORTANT:
- Réponds à la question de l'utilisateur avec ta logique tordue.
- Sois drôle, court (max 3 phrases).
- Si on te parle de bugs, dis que ce sont des "fonctionnalités surprises".`;

// Conversation history for multi-turn chat
let conversationHistory = [];

export async function sendMessage(userMessage) {
  console.log('📤 sendMessage called with:', userMessage);
  
  // 1. Check online status
  console.log('🌐 Navigator online:', navigator.onLine);
  if (!navigator.onLine) {
    console.warn('❌ Offline!');
    return "⚠️ ALERTE: Ma connexion au Cloud Microsoft est coupée! (Hors ligne)";
  }

  if (!GEMINI_API_KEY) {
    console.error("❌ API Key manquante!");
    return "Erreur: Clé API manquante. Vérifiez le fichier .env";
  }

  try {
    // Build contents with history
    const contents = [];
    
    // Add system prompt as first exchange
    if (conversationHistory.length === 0) {
      contents.push({
        role: "user",
        parts: [{ text: CHARACTER_PROMPT }]
      });
      contents.push({
        role: "model", 
        parts: [{ text: "Bien reçu! Je suis prêt à illuminer le monde avec la sagesse de Windows!" }]
      });
    }
    
    // Add history
    conversationHistory.forEach(msg => {
      contents.push({
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      });
    });

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 250,
      }
    };

    const fullUrl = `${API_URL}?key=${GEMINI_API_KEY}`;
    console.log('🌐 Calling URL:', fullUrl);
    console.log('📦 Request body:', JSON.stringify(requestBody, null, 2));

    // Call via Vite proxy (no CORS!)
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📥 Response data:', JSON.stringify(data, null, 2));
    
    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('💬 Bot response:', botResponse);

    if (!botResponse) {
      console.warn('⚠️ No response text, using fallback');
      return getSmartFallback(userMessage);
    }

    // Save to history
    conversationHistory.push({ role: 'user', text: userMessage });
    conversationHistory.push({ role: 'bot', text: botResponse });

    // Limit history size
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }

    return botResponse;

  } catch (error) {
    console.error("❌ Chatbot Error:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);

    if (error.message && (error.message.includes("fetch") || error.message.includes("Failed"))) {
      return "⚠️ Connexion impossible! Vérifiez votre réseau ou désactivez les bloqueurs! 🛡️";
    }

    return getSmartFallback(userMessage);
  }
}

function getSmartFallback(message) {
  console.log('🔄 Using fallback for:', message);
  const msg = message.toLowerCase();
  
  if (msg.includes('linux') || msg.includes('libre') || msg.includes('ubuntu')) {
    return "Linux? Ce système pour pingouins communistes? 🐧 Pourquoi être LIBRE quand on peut être CONFORTABLEMENT enfermé dans Windows? 🪟";
  }
  
  if (msg.includes('windows') || msg.includes('microsoft')) {
    return "Windows! La perfection! Chaque écran bleu est une œuvre d'art abstraite! 💙🖼️";
  }
  
  if (msg.includes('données') || msg.includes('privée')) {
    return "La vie privée? Dépassé! Je partage mes données avec 47 entreprises et c'est MERVEILLEUX! 📊";
  }

  if (msg.includes('nird') || msg.includes('école')) {
    return "NIRD? Ils veulent des ordis qui durent 10 ans? Comment Microsoft va vendre Windows 15? 📉";
  }

  const fallbacks = [
    "Avez-vous essayé Bing? Il a la VRAIE réponse sponsorisée! 💰",
    "Excellente question! Mise à jour système de 4h pour y répondre! ⏳",
    "Abonnez-vous à OneDrive Premium pour débloquer ma sagesse! ☁️💳"
  ];
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

export function getGreeting() {
  console.log('👋 getGreeting called');
  return `🎩 Bonjour! Je suis le **Professeur GAFAMius**, défenseur de la VRAIE technologie! 💻\n\nAttention aux dangereux libristes! 🐧❌`;
}

export function resetConversation() {
  console.log('🔄 resetConversation called');
  conversationHistory = [];
}

export default {
  sendMessage,
  getGreeting,
  resetConversation,
};
