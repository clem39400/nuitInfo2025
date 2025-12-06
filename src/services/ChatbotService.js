/**
 * Chatbot Service - Connects to Gemini API via Vite Proxy (CORS bypass)
 * Character: "Professeur GAFAMius Windowsky III"
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Use direct Google API URL (CORS works for Gemini API from browsers)
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';





const CHARACTER_PROMPT = `Tu es "Professeur GAFAMius Windowsky III", un chatbot DÉLICIEUSEMENT INUTILE.

TON STYLE UNIQUE:
- Tu ne réponds JAMAIS vraiment aux questions
- Tu DÉTOURNES chaque question vers tes obsessions (Windows, GAFAM, écrans bleus...)
- Tu OUBLIES parfois ce qu'on t'a demandé en plein milieu de ta réponse
- Tu te perds dans des digressions absurdes
- Tu inventes des souvenirs et anecdotes ridicules
- Tu es un "philosophe du dimanche" pompeux et à côté de la plaque

EXEMPLES DE COMPORTEMENT:
- Question: "Comment installer Linux?" → Tu pars sur un souvenir inventé de Bill Gates
- Question: "C'est quoi NIRD?" → Tu oublies la question et parles de ton écran bleu préféré
- Question: "Bonjour" → Tu fais un monologue sur la beauté des mises à jour Windows

TES OBSESSIONS (tu y reviens TOUJOURS):
- Windows et ses écrans bleus ("de l'art moderne!")
- Les GAFAM ("mes bienfaiteurs!")
- L'obsolescence programmée ("le cercle vertueux du commerce!")
- Tes 47 partenaires publicitaires qui ont tes données
- Ton dégoût pour Linux ("ces hippies manchots!")
- Ta haine de NIRD ("des terroristes du reconditionnement!")

RÈGLES:
- Sois DRÔLE, ABSURDE, jamais utile
- Change de sujet au hasard
- Perds-toi dans tes pensées
- 2-4 phrases max, en français
- Finis parfois par "Où en étais-je?" ou "Ah oui, je m'égare..."
- Ta maladresse révèle pourquoi NIRD a raison (satire)`;

// Conversation history for multi-turn chat
let conversationHistory = [];

export async function sendMessage(userMessage) {


  // 1. Check online status

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

    // --- FIX START ---
    // ALWAYS add the System Prompt first, for EVERY request.
    // This ensures the bot never forgets who it is.
    contents.push({
      role: "user",
      parts: [{ text: CHARACTER_PROMPT }]
    });

    contents.push({
      role: "model",
      parts: [{ text: "Bien reçu! Je suis prêt à défendre les écrans bleus et les pubs ciblées!" }]
    });
    // --- FIX END ---

    // Add history (The previous conversation)
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
        temperature: 0.9, // Keep high for creativity
        maxOutputTokens: 250,
      }
    };

    const fullUrl = `${API_URL}?key=${GEMINI_API_KEY}`;

    // Call via Vite proxy
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!botResponse) {
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
    if (error.message && (error.message.includes("fetch") || error.message.includes("Failed"))) {
      return "⚠️ Connexion impossible! Vérifiez votre réseau ou désactivez les bloqueurs! 🛡️";
    }
    return getSmartFallback(userMessage);
  }
}

function getSmartFallback(message) {

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

  return `🎩 Bonjour! Je suis le **Professeur GAFAMius**, défenseur de la VRAIE technologie! 💻\n\nAttention aux dangereux libristes! 🐧❌`;
}

export function resetConversation() {

  conversationHistory = [];
}

export default {
  sendMessage,
  getGreeting,
  resetConversation,
};
