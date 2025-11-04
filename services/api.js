// NOTA: Evita exponer claves en el cliente. Idealmente mueve esta llamada a un backend.
// Permitimos leer desde una variable de entorno de Expo si existe y, si no, caemos al valor actual.
// En Expo, las variables públicas suelen empezar por EXPO_PUBLIC_.
const AI21_API_KEY = process.env.EXPO_PUBLIC_AI21_API_KEY || '844c3cb5-c162-44e0-8f06-d1102f418e10';
const AI21_CHAT_API_URL = process.env.EXPO_PUBLIC_AI21_CHAT_API_URL || 'https://api.ai21.com/studio/v1/chat/completions'; // Endpoint para Jamba Chat (requiere acceso habilitado)
const AI21_MODEL = process.env.EXPO_PUBLIC_AI21_MODEL || 'jamba-mini';

export const askGPTNeo = async (userInput) => {
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
};