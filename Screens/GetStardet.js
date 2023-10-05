import React from "react";
import { Image,View,Text, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Singup from "./Singup";

export default function GetStarted()
{
    const navigation = useNavigation();
    const handleSingupSelection = () => {
        navigation.navigate('Singup');
      };
return(
    <View style={{backgroundColor:'#ff9a00',flex: 1}}>
<Text style={{fontSize:25,textAlign:'center',color:'white',marginBottom:0, position:"relative",top:100,padding:20,fontStyle:'italic'}}>ChatLingo is a revolutionary chat application designed to bridge communication gaps by instantly translating messages into the recipient's native language.</Text>
<TouchableOpacity onPress={handleSingupSelection} style={{ alignSelf: 'center', position: 'relative', top: 150, borderColor: 'white', borderWidth: 3, paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30, borderRadius: 50, marginTop: 0 }}>
  <Text style={{ fontSize: 30, color: "white" }}>Get started!</Text>
</TouchableOpacity>
    </View>
)
}