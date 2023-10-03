import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Settings() {
  const navigation = useNavigation();

  const handleHomeScreenSelection = () => {
    navigation.navigate('Home');
  };
  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <View style={{ alignSelf: 'center', height: 100, width: 450 }}>
        <Text style={{ alignSelf: 'center', position: 'relative', top: 50, fontWeight: 'bold', fontSize: 25 }}>Settings</Text>
        <TouchableOpacity
          onPress={handleHomeScreenSelection}
          style={{ position: 'relative', left: 80, top: 15 }}
        >
          <FontAwesome name="angle-left" size={35} color="black" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity>
      <View style={{marginTop:30,height:200,width:300,backgroundColor:'lightgray',alignSelf:'center',borderRadius:30}}>
<View style={{backgroundColor:'black',height:100,width:100,alignSelf:'center',borderRadius:50,position:'relative'}}></View>
<View style={{alignSelf:'center',height:100,width:300,backgroundColor:'#ff9a00',borderBottomEndRadius:30,alignSelf:'center',borderBottomLeftRadius:30}}>
    <Text style={{alignSelf:'center',position:'relative',top:30,color:'white',fontWeight:'bold',fontSize:20}}>Nume Utilizator</Text>
</View>
</View>
      </TouchableOpacity>
      <TouchableOpacity>
<View style={{paddingLeft:30,height:70,width:300,backgroundColor:'lightgray',borderRadius:30,alignSelf:'center',marginTop:20}}>
<FontAwesome name="bell" size={30} color='gray' style={{position:'relative',top:20}}/>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'gray',position:'relative',bottom:10}}>Notifications</Text>
</View>
</TouchableOpacity>
<TouchableOpacity>
<View style={{paddingLeft:30,height:70,width:300,backgroundColor:'lightgray',borderRadius:30,alignSelf:'center',marginTop:20}}>
<FontAwesome name="bell" size={30} color='gray' style={{position:'relative',top:20}}/>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'gray',position:'relative',bottom:10}}>Notifications</Text>
</View>
</TouchableOpacity>
<TouchableOpacity>
<View style={{paddingLeft:30,height:70,width:300,backgroundColor:'lightgray',borderRadius:30,alignSelf:'center',marginTop:20}}>
<FontAwesome name="bell" size={30} color='gray' style={{position:'relative',top:20}}/>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'gray',position:'relative',bottom:10}}>Notifications</Text>
</View>
</TouchableOpacity>
    </View>
  );
}
