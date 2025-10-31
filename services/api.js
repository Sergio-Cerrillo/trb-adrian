const AI21_API_KEY = '844c3cb5-c162-44e0-8f06-d1102f418e10';
const AI21_CHAT_API_URL = 'https://api.ai21.com/studio/v1/chat/completions'; // Endpoint para Jamba Chat

export const askGPTNeo = async (userInput) => {
  console.log("[api.js] AI21 Jamba Chat: Entrando con userInput:", userInput);

  if (AI21_API_KEY === 'TU_AI21_API_KEY') {
    const errorMessage = "Por favor, configura tu AI21_API_KEY en services/api.js para usar AI21 Studio.";
    console.error(errorMessage);
    return errorMessage;
  }

  try {
    const payload = {
      model: "jamba-mini", // Usando el modelo jamba-mini
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
        // errorBodyText is already set
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