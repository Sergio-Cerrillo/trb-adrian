import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const screenWidth=Dimensions.get('window').width;

export default function HomeScreen() {
  
  return (
    <View style={maquetacion.View}>
      <Text style={maquetacion.Bienvenido}>Bienvenid@!</Text>
      <Image source={require('../assets/logo.png')} style={maquetacion.Logo} />
    <View style={maquetacion.View2}>
      <TouchableOpacity style={maquetacion.Pulsador} onPress={() => router.push('/SignatureSelector')}>
        <Text style={maquetacion.Accede}>Accede</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

  const maquetacion=StyleSheet.create({
    View:{
     backgroundColor:'#423c30',
     flex:1,
     paddingTop:40
    },
    Bienvenido:{
      textAlign:'center',
      fontSize:40,
      color:'white',
      marginBottom:20
    },
    View2:{
      flex:1,
      justifyContent:'center',
      alignItems:'center'
    },
    Accede:{
      color:'white',
      fontSize:20
    },
    Logo:{
      width:screenWidth,
      height:undefined,
      aspectRatio:1,
      resizeMode:'contain'
    },
    Pulsador:{
      borderWidth:1,
      borderColor:'white',
      padding:10,
      backgroundColor:'black',
      marginTop:-200
    }
  })