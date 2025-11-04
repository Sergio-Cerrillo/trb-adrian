// NOTA: Evita exponer claves en el cliente. Idealmente mueve esta llamada a un backend.
// En Expo, las variables públicas suelen empezar por EXPO_PUBLIC_. Usa esto solo para desarrollo.
// --- Configuración general ---
const PROVIDER = (process.env.EXPO_PUBLIC_AI_PROVIDER || 'gemini').toLowerCase(); // 'gemini' | 'ai21'

// --- AI21 config ---
const AI21_API_KEY = process.env.EXPO_PUBLIC_AI21_API_KEY || '';
const AI21_CHAT_API_URL = process.env.EXPO_PUBLIC_AI21_CHAT_API_URL || 'https://api.ai21.com/studio/v1/chat/completions'; // Endpoint para Jamba Chat (requiere acceso habilitado)
const AI21_MODEL = process.env.EXPO_PUBLIC_AI21_MODEL || 'jamba-mini';

// --- Gemini config (free tier) ---
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.EXPO_PUBLIC_GEMINI_MODEL || 'gemini-1.5-flash';

// --- Implementaciones de proveedores ---
async function askGemini(userInput) {
  console.log("[api.js] Gemini: Entrando con userInput:", userInput);

  if (!GEMINI_API_KEY) {
    const errorMessage = 'Configura EXPO_PUBLIC_GEMINI_API_KEY para usar Google Gemini (free tier).';
    console.error(errorMessage);
    return errorMessage;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: userInput }],
        },
      ],
    };

    console.log("[api.js] Gemini: POST", url);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log("[api.js] Gemini: Status:", response.status);
    const text = await response.text();
    if (!response.ok) {
      let details = text;
      try {
        const j = JSON.parse(text);
        details = j.error?.message || JSON.stringify(j);
      } catch {}
      if (response.status === 401 || response.status === 403) {
        return `No autorizado/Prohibido en Gemini (${response.status}). Revisa tu EXPO_PUBLIC_GEMINI_API_KEY.`;
      }
      throw new Error(`Error Gemini ${response.status}: ${details}`);
    }

    const data = JSON.parse(text);
    console.log("[api.js] Gemini: Data:", data);
    const generatedText = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('')?.trim();
    if (generatedText) return generatedText;
    throw new Error('La respuesta de Gemini no tiene el formato esperado.');
  } catch (error) {
    console.error('[api.js] Gemini: Error en catch:', error);
    return `Hubo un error conectando con Gemini: ${error.message || String(error)}`;
  }
}

async function askAi21(userInput) {
  console.log("[api.js] AI21 Jamba Chat: Entrando con userInput:", userInput);

  if (!AI21_API_KEY || AI21_API_KEY === 'TU_AI21_API_KEY') {
    const errorMessage = "Configura la clave AI21_API_KEY (p. ej. EXPO_PUBLIC_AI21_API_KEY) para usar AI21 Studio.";
    console.error(errorMessage);
    return errorMessage;
  }

  try {
    const payload = {
      model: AI21_MODEL, // Usando modelo configurable por ENV
      messages: [
        {
          role: "user",
          content: userInput
        }
        // Configurar historial de mensajes a futuro
      ],
      max_tokens: 150,
      temperature: 0.7, // Controla la creatividad (0.0 más determinista, 1.0 más creativo) [Se ha elegido Jamba Mini por esto]
      top_p: 1.0

    };

    console.log("[api.js] AI21 Jamba Chat: Realizando fetch a:", AI21_CHAT_API_URL);
    console.log("[api.js] AI21 Jamba Chat: Payload:", JSON.stringify(payload));

    const response = await fetch(AI21_CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI21_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log("[api.js] AI21 Jamba Chat: Fetch completado. Status:", response.status);

    if (!response.ok) {
      const errorBodyText = await response.text();
      let errorDetails = errorBodyText;
      try {
        const errorJson = JSON.parse(errorBodyText);
        errorDetails = errorJson.detail || errorJson.message || JSON.stringify(errorJson);
      } catch (e) {
        // dejamos errorBodyText tal cual
      }

      // Mensajes más claros según status
      if (response.status === 401) {
        console.error("[api.js] AI21 Jamba Chat: 401 Unauthorized. Revisa la clave API.");
        return "No autorizado en AI21 (401): revisa tu API key o configúrala en EXPO_PUBLIC_AI21_API_KEY.";
      }
      if (response.status === 403) {
        console.error("[api.js] AI21 Jamba Chat: 403 Forbidden. Tu clave no tiene acceso a Chat Completions/Jamba o el feature no está habilitado en tu cuenta.");
        return "Tu cuenta de AI21 no tiene acceso a Chat Completions/Jamba (403). Habilita el feature en AI21, cambia de modelo/endpoint o usa un backend proxy.";
      }

      console.error("[api.js] AI21 Jamba Chat: Respuesta no OK. Status:", response.status, "Body:", errorBodyText);
      throw new Error(`Error en la respuesta de AI21 Jamba Chat API: ${response.status} ${response.statusText} - Detalles: ${errorDetails}`);
    }

    const data = await response.json();
  console.log("[api.js] AI21 Jamba Chat: res.json() procesado. Data:", data);

    // Respuesta
    if (data?.choices && data.choices.length > 0 && data.choices[0]?.message?.content) {
      const generatedText = data.choices[0].message.content.trim();
      console.log("[api.js] AI21 Jamba Chat: Texto generado:", generatedText);
      return generatedText;
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      console.error("[api.js] AI21 Jamba Chat: La respuesta de la API no tiene el formato esperado. Data:", data);
      throw new Error('La respuesta de AI21 Jamba Chat API no tiene el formato esperado.');
    }

  } catch (error) {
    console.error('[api.js] AI21 Jamba Chat: Error en el bloque catch:', error);
    return `Hubo un error conectando con AI21 Jamba Chat: ${error.message || String(error)}`;
  }
}

// --- API pública usada por la app ---
export const askGPTNeo = async (userInput) => {
  try {
    if (PROVIDER === 'gemini') {
      return await askGemini(userInput);
    }
    if (PROVIDER === 'ai21') {
      return await askAi21(userInput);
    }
    console.warn(`[api.js] Proveedor desconocido: ${PROVIDER}. Usando Gemini por defecto.`);
    return await askGemini(userInput);
  } catch (e) {
    console.error('[api.js] askGPTNeo: Error general:', e);
    return `Error inesperado: ${e.message || String(e)}`;
  }
};