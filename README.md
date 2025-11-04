# TRB app (Expo)

Este proyecto usa Expo y ahora incluye un servicio de chat IA con proveedor seleccionable por variables de entorno. Por defecto usa Google Gemini (free tier), y opcionalmente AI21.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Variables de entorno (IA)

   Crea variables de entorno antes de arrancar. Para desarrollo puedes exportarlas temporalmente en la misma línea del comando.

   Opción recomendada (gratis): Gemini

   ```bash
   # Proveedor por defecto
   export EXPO_PUBLIC_AI_PROVIDER=gemini
   # Clave de Gemini (consigue una en https://aistudio.google.com/app/apikey)
   export EXPO_PUBLIC_GEMINI_API_KEY=TU_CLAVE_GEMINI
   # (Opcional) Modelo
   export EXPO_PUBLIC_GEMINI_MODEL=gemini-1.5-flash
   ```

   Opción alternativa: AI21 (requiere plan/feature de Chat Completions)

   ```bash
   export EXPO_PUBLIC_AI_PROVIDER=ai21
   export EXPO_PUBLIC_AI21_API_KEY=TU_CLAVE_AI21
   export EXPO_PUBLIC_AI21_MODEL=jamba-mini
   export EXPO_PUBLIC_AI21_CHAT_API_URL=https://api.ai21.com/studio/v1/chat/completions
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
