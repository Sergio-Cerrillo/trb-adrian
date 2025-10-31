import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { askGPTNeo } from "../services/api";

const coloresPorAsignatura: Record<string, string> = {
    castellano: '#a61111',
    matematicas: 'blue',
    catalan: 'yellow',
    filosofia: 'purple', 
    fisica: 'brown',
    quimica: '#000082',
    ingles: '#d41560',
    biologia: 'green',
    dibujotecnico: 'black',
    programacion: '#00ffbd',
    frances: '#0cff00',
    tecnologia: '#ff9e00',
  };

  const nombresBonitos: Record<string, string> = {
    castellano: "Castellano",
    matematicas:"Matemáticas",
    catalan:"Catalán",
    filosofia:"Filosofía",
    fisica:"Física",
    quimica:"Química",
    ingles:"Inglés",
    biologia:"Biología",
    dibujotecnico:"Dibujo Técnico",
    programacion:"Programación",
    frances:"Francés",
    tecnologia:"Tecnología",
  };
  const coloresLetras : Record<string, string> = {
    castellano: 'white',
    matematicas: 'white',
    catalan: 'black',
    filosofia: 'white',
    fisica: 'white',
    quimica: 'white',
    ingles: 'white',
    biologia: 'white',
    dibujotecnico: 'white',
    programacion: 'black',
    frances: 'black',
    tecnologia: 'black',
  }

const AskToGpt = ()=>{
    const { asignatura } = useLocalSearchParams();
    const clave = Array.isArray(asignatura) ? asignatura[0] : asignatura || '';
    const colorFondo = coloresPorAsignatura[clave] || '#ddd';
    const nombreBonito = nombresBonitos[clave] || clave;

    //estados
    const [inputText, setInputText] = useState('');
    const [respuesta, setRespuesta] = useState('');
    const [cargando, setCargando] = useState(false);
  
    const handleSend = async () => {
      if (!inputText.trim()) return;
      setCargando(true);
      setRespuesta(''); // Limpiar respuesta anterior
      try {
        console.log("[AskToGpt.tsx] Enviando pregunta a AI21 Jamba Chat:", inputText);
        const reply = await askGPTNeo(inputText);
        console.log("[AskToGpt.tsx] Respuesta recibida de AI21 Jamba Chat:", reply);
        setRespuesta(reply);
      } catch (error) {
        console.error("[AskToGpt.tsx] Error en handleSend al llamar a askGPTNeo:", error);
        setRespuesta(`Error al procesar la solicitud: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setCargando(false); // Asegurar que cargando siempre se desactive
      }
    };
  
  return (
    <View style={maquetacion.global}>
      <View style={[maquetacion.encabezado, { backgroundColor: colorFondo }]}>
        <Text style={[maquetacion.textoTitulo, { color: coloresLetras[clave] || '#000' }]}>
          {nombreBonito}
        </Text>
      </View>

      <ScrollView style={maquetacion.respuestaContainer}>
        {respuesta ? <Text style={maquetacion.respuestaTexto}>{respuesta}</Text> : null}
      </ScrollView>

      <View style={maquetacion.preguntaContainer}>
        <TextInput
          style={maquetacion.pregunta}
          placeholder="Escribe tu pregunta"
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title={cargando ? "Enviando..." : "Enviar"} onPress={handleSend} disabled={cargando} />
      </View>
    </View>
  );
};

const maquetacion = StyleSheet.create({
  global: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  encabezado: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  textoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  preguntaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  pregunta: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  respuestaContainer: {
    flex: 1,
    padding: 10,
    marginTop: 10,
  },
  respuestaTexto: {
    fontSize: 16,
    color: '#333',
  },
});

export default AskToGpt;