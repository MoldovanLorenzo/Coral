import React from "react";
import { View, Text, TouchableOpacity, ScrollView} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Settings() {
  const navigation = useNavigation();

  const handleProfileSelection= () => {
    navigation.navigate('Profile');
  }
  const handleAsisteceScreenSelection = () => {
    navigation.navigate('Asistence');
  };
  const handlFeedbadScreenSelection = () => {
    navigation.navigate('Feedback');
  };
  const handleLanguageScreenSelection = () => {
    navigation.navigate('Language');
  };
  const handleNotificationsScreenSelection = () => {
    navigation.navigate('Notifications');
  };
  const handleThemesScreenSelection = () => {
    navigation.navigate('Themes');
  };

  const handleHomeScreenSelection = () => {
    navigation.navigate('Home');
  };
  return (
    <ScrollView>
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
      <TouchableOpacity  onPress={handleProfileSelection}>
      <View style={{marginTop:30,height:200,width:300,backgroundColor:'lightgray',alignSelf:'center',borderRadius:30}}>
<View style={{backgroundColor:'black',height:100,width:100,alignSelf:'center',borderRadius:50,position:'relative'}}></View>
<View style={{alignSelf:'center',height:100,width:300,backgroundColor:'#ff9a00',borderBottomEndRadius:30,alignSelf:'center',borderBottomLeftRadius:30}}>
    <Text style={{alignSelf:'center',position:'relative',top:30,color:'white',fontWeight:'bold',fontSize:20}}>Nume Utilizator</Text>
</View>
</View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNotificationsScreenSelection}>
<View style={{paddingLeft:30,height:70,width:300,backgroundColor:'lightgray',borderRadius:30,alignSelf:'center',marginTop:20}}>
<FontAwesome name="bell" size={30} color='gray' style={{position:'relative',top:20}}/>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'gray',position:'relative',bottom:10}}>Notifications</Text>
</View>
</TouchableOpacity>
<TouchableOpacity onPress={handleLanguageScreenSelection}>
<View style={{paddingLeft:30,height:70,width:300,backgroundColor:'lightgray',borderRadius:30,alignSelf:'center',marginTop:20}}>
<FontAwesome name="language" size={30} color='gray' style={{position:'relative',top:20}}/>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'gray',position:'relative',bottom:10}}>Language</Text>
</View>
</TouchableOpacity>
<TouchableOpacity onPress={handleThemesScreenSelection}>
<View style={{paddingLeft:30,height:70,width:300,backgroundColor:'lightgray',borderRadius:30,alignSelf:'center',marginTop:20}}>
<FontAwesome name="star" size={30} color='gray' style={{position:'relative',top:20}}/>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'gray',position:'relative',bottom:10}}>Themes</Text>
</View>
</TouchableOpacity>
<TouchableOpacity onPress={handleAsisteceScreenSelection}>
<View style={{paddingLeft:30,height:70,width:300,backgroundColor:'lightgray',borderRadius:30,alignSelf:'center',marginTop:20}}>
<FontAwesome name="question" size={30} color='gray' style={{position:'relative',top:20}}/>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'gray',position:'relative',bottom:10}}>Asistence</Text>
</View>
</TouchableOpacity>
<TouchableOpacity onPress={handlFeedbadScreenSelection}>
<View style={{paddingLeft:30,height:70,width:300,backgroundColor:'lightgray',borderRadius:30,alignSelf:'center',marginTop:20}}>
<FontAwesome name="comment" size={30} color='gray' style={{position:'relative',top:20}}/>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'gray',position:'relative',bottom:10}}>feedback</Text>
</View>
</TouchableOpacity>
<TouchableOpacity>
<View style={{paddingLeft:30,height:70,width:300,backgroundColor:'#ff7b7b',borderRadius:30,alignSelf:'center',marginTop:20}}>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'#ff5252',position:'relative',marginTop:20}}>Log out</Text>
</View>
</TouchableOpacity>
    </View>
    </ScrollView>
  );
}
