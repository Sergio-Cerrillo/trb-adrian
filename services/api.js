
// --- Implementaciones de proveedores ---
async function askGemini(userInput) {
  console.log("[api.js] Gemini: Entrando con userInput:", userInput);

  if (!GEMINI_API_KEY) {
    const errorMessage = 'Configura EXPO_PUBLIC_GEMINI_API_KEY o pega tu clave en services/api.js (GEMINI_API_KEY).';
    console.error(errorMessage);
    return errorMessage;
  }

  try {
    const buildGenUrl = (model, version) => `https://generativelanguage.googleapis.com/${version}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const buildListUrl = (version) => `https://generativelanguage.googleapis.com/${version}/models?key=${encodeURIComponent(GEMINI_API_KEY)}`;

    const doCall = async (url) => {
      console.log("[api.js] Gemini: POST", url.replace(/key=[^&]+/, 'key=***'));
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const text = await response.text();
      return { response, text };
    };

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: userInput }],
        },
      ],
    };

    // Primer intento: versión configurada y modelo configurado
    let versionTried = GEMINI_API_VERSION;
    let modelTried = GEMINI_MODEL;
    let { response, text } = await doCall(buildGenUrl(modelTried, versionTried));
    console.log("[api.js] Gemini: Status:", response.status, "version:", versionTried, "model:", modelTried);

    // Si 404, probamos fallback: variantes de modelo y cambio de versión v1<->v1beta
    if (response.status === 404) {
      // 1) Probar variantes comunes (-latest)
      const variants = [];
      const base = modelTried.replace(/-latest$/, '');
      variants.push(`${base}-latest`);
      variants.push(base);
      for (const v of variants) {
        if (v !== modelTried) {
          modelTried = v;
          ({ response, text } = await doCall(buildGenUrl(modelTried, versionTried)));
          console.log("[api.js] Gemini: Retry Status:", response.status, "version:", versionTried, "model:", modelTried);
          if (response.status !== 404) break;
        }
      }
      // 2) si sigue 404, cambiamos de versión (v1 <-> v1beta)
      if (response.status === 404) {
        versionTried = versionTried === 'v1' ? 'v1beta' : 'v1';
        ({ response, text } = await doCall(buildGenUrl(modelTried, versionTried)));
        console.log("[api.js] Gemini: Retry Status:", response.status, "version:", versionTried, "model:", modelTried);
      }
      // 3) si sigue 404, autodetectamos modelos disponibles y reintentamos con uno soportado
      if (response.status === 404) {
        try {
          const listUrl = buildListUrl(versionTried);
          console.log("[api.js] Gemini: GET", listUrl.replace(/key=[^&]+/, 'key=***'));
          const listRes = await fetch(listUrl);
          const listText = await listRes.text();
          if (listRes.ok) {
            const list = JSON.parse(listText);
            const models = (list.models || []).map(m => m.name).filter(Boolean);
            // Preferimos modelos flash del panel: 2.5-flash > 2.0-flash > 2.0-flash-lite > 2.5-flash-lite > cualquier 'flash'
            const preferred = models.find(n => /models\/gemini-2\.5-flash(-latest)?$/i.test(n))
              || models.find(n => /models\/gemini-2\.0-flash(-latest)?$/i.test(n))
              || models.find(n => /models\/gemini-2\.0-flash-lite(-latest)?$/i.test(n))
              || models.find(n => /models\/gemini-2\.5-flash-lite(-latest)?$/i.test(n))
              || models.find(n => /models\/gemini-.*flash/i.test(n))
              || models[0];
            if (preferred) {
              modelTried = preferred.replace(/^models\//, '');
              ({ response, text } = await doCall(buildGenUrl(modelTried, versionTried)));
              console.log("[api.js] Gemini: Retry with listed model -> Status:", response.status, "version:", versionTried, "model:", modelTried);
            } else {
              console.warn("[api.js] Gemini: No se encontraron modelos compatibles en ListModels.");
            }
          } else {
            console.warn("[api.js] Gemini: ListModels no OK:", listRes.status, listText);
          }
        } catch (e) {
          console.warn("[api.js] Gemini: Error al listar modelos:", e);
        }
      }
    }

    if (!response.ok) {
      let details = text;
      try {
        const j = JSON.parse(text);
        details = j.error?.message || JSON.stringify(j);
      } catch { }
      if (response.status === 401 || response.status === 403) {
        return `No autorizado/Prohibido en Gemini (${response.status}). Revisa tu EXPO_PUBLIC_GEMINI_API_KEY.`;
      }
      if (response.status === 429) {
        // Extrae sugerencia de reintento si viene en el mensaje
        const retryMatch = /retry in\s+([0-9.]+)s/i.exec(details);
        const wait = retryMatch ? ` Espera ~${retryMatch[1]}s y vuelve a intentar.` : '';
        // Si el mensaje indica límites 0, explica que falta habilitar plan/billing
        const zeroQuota = /limit:\s*0/i.test(details) || /limit\s*:\s*0/i.test(details);
        const quotaMsg = zeroQuota
          ? 'Tu clave no tiene cuota activa (límite 0) en el plan gratuito. Activa el plan en AI Studio o vincula facturación para obtener cuota.'
          : 'Has alcanzado el límite temporal de tu plan.';
        return `Límite de cuota Gemini (429): ${quotaMsg}${wait}`;
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
