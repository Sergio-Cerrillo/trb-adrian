# TRB app (Expo)

Este proyecto usa Expo y un servicio de chat IA basado únicamente en Google Gemini (free tier).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Configuración de la API Key (Gemini)

   Puedes configurar la clave de dos formas:

   a) Pegándola en el código (rápido para desarrollo):

   - Abre `services/api.js` y reemplaza el valor de `GEMINI_API_KEY` en la línea indicada (`PON_AQUI_TU_API_KEY`).

   b) Usando variable de entorno (recomendado para no versionar claves):

   ```bash
   # Clave de Gemini (consigue una en https://aistudio.google.com/app/apikey)
   export EXPO_PUBLIC_GEMINI_API_KEY=TU_CLAVE_GEMINI
   # (Opcional) Modelo
   export EXPO_PUBLIC_GEMINI_MODEL=gemini-1.5-flash
   ```

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

Puedes empezar a desarrollar editando los ficheros en **app**. El servicio de IA está en `services/api.js` y expone `askGPTNeo(userInput)` que devuelve un texto con la respuesta o un mensaje de error legible.

Notas de seguridad:

- No expongas claves reales en producción. Para producción, mueve la llamada a un backend propio y mantén las claves fuera del cliente.
- En desarrollo, las variables `EXPO_PUBLIC_*` quedan embebidas en el cliente.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
