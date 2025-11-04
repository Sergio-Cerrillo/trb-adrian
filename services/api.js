// IMPORTANTE: Evita exponer claves reales en producción. Para producción, mueve esta llamada a un backend propio.
// Para desarrollo puedes pegar tu API key aquí o usar la variable de entorno EXPO_PUBLIC_GEMINI_API_KEY.

// --- Gemini config (free tier) ---
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'PON_AQUI_TU_API_KEY';
const GEMINI_MODEL = process.env.EXPO_PUBLIC_GEMINI_MODEL || 'gemini-1.5-flash';

// --- Implementaciones de proveedores ---
async function askGemini(userInput) {
  console.log("[api.js] Gemini: Entrando con userInput:", userInput);

  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'PON_AQUI_TU_API_KEY') {
    const errorMessage = 'Configura EXPO_PUBLIC_GEMINI_API_KEY o pega tu clave en services/api.js (GEMINI_API_KEY).';
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

// Eliminado: implementación anterior de AI21 (ya no se usa)

// --- API pública usada por la app ---
export const askGPTNeo = async (userInput) => {
  try {
    return await askGemini(userInput);
  } catch (e) {
    console.error('[api.js] askGPTNeo: Error general:', e);
    return `Error inesperado: ${e.message || String(e)}`;
  }
};