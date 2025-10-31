import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SignatureSelector=()=>{
    
    
    const handlePress=(asignatura:any) => {
        router.push({
            pathname: '/AskToGpt',
            params: { asignatura }
          });
    }
    return(
        <View style={maquetacion.AsignaturasGlobal}>
        <View style={maquetacion.Columnas}>

        
        <TouchableOpacity onPress={()=>handlePress('castellano')} style={maquetacion.BotonCastellano}>
            <Text style={maquetacion.BotonTextoBlanco}>Castellano</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>handlePress('matematicas')} style={maquetacion.BotonMatematicas}>
            <Text style={maquetacion.BotonTextoBlanco}>Matemáticas</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>handlePress('catalan')} style={maquetacion.BotonCatalan}>
            <Text>Catalán</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={()=>handlePress('filosofia')} style={maquetacion.BotonFilosofia}>
            <Text style={maquetacion.BotonTextoBlanco}>Filosofia</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>handlePress('fisica')} style={maquetacion.BotonFisica}>
            <Text style={maquetacion.BotonTextoBlanco}>Física</Text>
            </TouchableOpacity>
        
            <TouchableOpacity onPress={()=>handlePress('quimica')} style={maquetacion.BotonQuimica}>
            <Text style={maquetacion.BotonTextoBlanco}>Química</Text>
            </TouchableOpacity>
        </View>
        <View style={maquetacion.Columnas}>
            <TouchableOpacity onPress={()=>handlePress('ingles')} style={maquetacion.BotonIngles}>
            <Text style={maquetacion.BotonTextoBlanco}>Inglés</Text>
            </TouchableOpacity>
       
            <TouchableOpacity onPress={()=>handlePress('biologia')} style={maquetacion.BotonBiologia}>
            <Text style={maquetacion.BotonTextoBlanco}>Biologia</Text>
            </TouchableOpacity>
        
            <TouchableOpacity onPress={()=>handlePress('dibujotecnico')} style={maquetacion.BotonDibujoTecnico}>
            <Text style={maquetacion.BotonTextoBlanco}>Dibujo Técnico</Text>
            </TouchableOpacity>
       
            <TouchableOpacity onPress={()=>handlePress('programacion')} style={maquetacion.BotonProgramacion}>
            <Text>Programación</Text>
            </TouchableOpacity>
        
            <TouchableOpacity onPress={()=>handlePress('frances')} style={maquetacion.BotonFrances}>
            <Text>Francés</Text>
            </TouchableOpacity>
        
            <TouchableOpacity onPress={()=>handlePress('tecnologia')} style={maquetacion.BotonTecnologia}>
            <Text>Tecnologia</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}
const maquetacion=StyleSheet.create({
    AsignaturasGlobal:{
        backgroundColor:'#423c30',
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    BotonCastellano:{
        backgroundColor:'#a61111', //rojo oscuro
        width:'60%',
        padding:10,
        alignItems:'center'
    },
    BotonMatematicas:{
        backgroundColor:'blue',
        width:'60%',
        padding:10,
        alignItems:'center'
    },
    BotonCatalan:{
        backgroundColor:'yellow',
        width:'60%',
        padding:10,
        alignItems:'center'
    },
    BotonFilosofia:{
        backgroundColor:'purple',
        width:'60%',
        padding:10,
        alignItems:'center'
    },
    BotonTextoBlanco:{
        color:'white',
    },
    BotonFisica:{
        backgroundColor:'brown',
        width:'60%',
        padding:10,
        alignItems:'center'
    },
    BotonQuimica:{
        backgroundColor:'#000082', //azul oscuro
        width:'60%',
        padding:10,
        alignItems:'center'
    },
    BotonIngles:{
        backgroundColor:'#d41560', //rosa oscuro
        width:'60%',
        padding:10,
        alignItems:'center'
    },
    BotonBiologia:{
        backgroundColor:'green',
        width:'60%',
        padding:10,
        alignItems:'center' 
    },
    BotonDibujoTecnico:{
        backgroundColor:'#000000', //negro
        width:'60%',
        padding:10,
        alignItems:'center'
    },
    BotonProgramacion:{
        backgroundColor:'#00ffbd', //turquesa
        width:'60%',
        padding:10,
        alignItems:'center'
    },
    BotonFrances:{
        backgroundColor:'#0cff00', //verde claro
        width:'60%',
        padding:10,
        alignItems:'center'
    },
    BotonTecnologia:{
        backgroundColor:'#ff9e00', //naranja
        width:'60%',
        padding:10,
        alignItems:'center'
    },
    Columnas:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    gap:70
    }
})
export default SignatureSelector
