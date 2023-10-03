import React from "react";
import { Image,View,Text, ImageBackground, TouchableOpacity } from "react-native";

export default function GetStarted()
{
return(
    <View style={{backgroundColor:'#ff9a00',flex: 1}}>
<Text style={{fontSize:25,textAlign:'center',color:'white',marginBottom:0, position:"relative",top:250,padding:20,fontStyle:'italic'}}>ChatLingo is a revolutionary chat application designed to bridge communication gaps by instantly translating messages into the recipient's native language.</Text>
        <TouchableOpacity style={{alignSelf:'center',position: 'relative',top:300,borderColor:'white',borderWidth: 3,paddingTop: 10,paddingBottom:10,paddingLeft:30,paddingRight:30,borderRadius:50, marginTop:0}}>
            <Text style={{fontSize:30, color:"white"}}>Get started!</Text>
        </TouchableOpacity>
    </View>
)
}