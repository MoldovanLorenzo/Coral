import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView,Image} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
export default function Settings({ isDarkMode, setIsDarkMode }) {
  const [username, setUsername] = useState('');
  const [photo, setPhoto] = useState(null);
  const defaultImage = require('../assets/default_user.png');
  const retrieveInfo = async () => {
    try {
      username_ = await AsyncStorage.getItem('user_username');
      photo_ = await AsyncStorage.getItem('user_photo');
      setPhoto(photo_)
      setUsername(username_)
      
    } catch (error) {
      console.log('Error retrieving user info from storage!' + error)
      return;
    }
  };
  useEffect(()=>{
    retrieveInfo().then(()=>{

    })
  })
  const navigation = useNavigation();

  
const handleProfileSelection = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
    return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
    base64: true,
  });

  if (!result.cancelled) {
    console.log(result.uri);
    
    const serverUrl = "https://copper-pattern-402806.ew.r.appspot.com/chatrooms";
    const auth_token=await AsyncStorage.getItem('auth_token')
    const resizedImage = await ImageManipulator.manipulateAsync(
      result.uri,
      [{ resize: { width: 350, height:250  } }], 
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization":auth_token
      },
      body: JSON.stringify({
        what:'updateUser',
        new_email:'null',
        new_language:'null',
        new_pfp:resizedImage.base64
      }),
    }).then((response) => response.json())
    .then(async (responseData) => {
      console.log("Response from server:", responseData);
      if(responseData.response=='OK'){
        await AsyncStorage.setItem('user_photo',resizedImage.base64)
        setPhoto(resizedImage.base64)
      }
    })
    .catch((error) => {
      console.error("Eroare de rețea:", error);
      return;
    })
};
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
  const handleSingout=async ()=>{
    await AsyncStorage.removeItem('auth_token')
    await AsyncStorage.removeItem('user_photo')
    navigation.navigate('Login')
  }
  return (
    <ScrollView>
    <View style={{ flex: 1, flexDirection: 'column',backgroundColor: isDarkMode ? '#191919' : 'white' }}>
      <View style={{ alignSelf: 'center', height: 100, width: 450 }}>
        <Text style={{ alignSelf: 'center', position: 'relative', top: 50, fontWeight: 'bold', fontSize: 25,color: isDarkMode ? 'gray' : 'black'}}>Settings</Text>
        <TouchableOpacity
          onPress={handleHomeScreenSelection}
          style={{ position: 'relative', left: 80, top: 15 }}
        >
          <FontAwesome name="angle-left" size={35} color="#ff9a00" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleProfileSelection}>
        <View style={{ marginTop: 30, height: 200, width: 300, alignSelf: 'center', borderRadius: 30 }}>
          <View style={{ backgroundColor: 'black', height: 100, width: 100, alignSelf: 'center', borderRadius: 50, position: 'relative' }}>
            {photo ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${photo}` }}
                style={{ height: 100, width: 100, borderRadius: 50 }}
              />
            ) : (
              <Image
                source={defaultImage}
                style={{ height: 100, width: 100, borderRadius: 50 }}
              />
            )}
          </View>
          <View style={{ alignSelf: 'center', height: 100, width: 300, backgroundColor: '#ff9a00', borderBottomEndRadius: 30, borderBottomLeftRadius: 30 }}>
            <Text style={{ alignSelf: 'center', position: 'relative', top: 30, color: isDarkMode ? 'gray' : 'white', fontWeight: 'bold', fontSize: 20 }}>
              {username || "Nume Utilizator"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNotificationsScreenSelection}>
<View style={{paddingLeft:30,height:70,width:300, backgroundColor: isDarkMode ? '#191919' : 'lightgray',borderRadius:30,alignSelf:'center',marginTop:20}}>
<FontAwesome name="bell" size={30} color='gray' style={{position:'relative',top:20}}/>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'gray',position:'relative',bottom:10}}>Notifications</Text>
</View>
</TouchableOpacity>
<TouchableOpacity onPress={handleLanguageScreenSelection}>
<View style={{paddingLeft:30,height:70,width:300,borderRadius:30,alignSelf:'center',marginTop:20,backgroundColor: isDarkMode ? '#191919' : 'lightgray'}}>
<FontAwesome name="language" size={30} color='gray' style={{position:'relative',top:20}}/>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'gray',position:'relative',bottom:10}}>Language</Text>
</View>
</TouchableOpacity>
<TouchableOpacity onPress={handleThemesScreenSelection}>
<View style={{paddingLeft:30,height:70,width:300,backgroundColor:'lightgray',borderRadius:30,alignSelf:'center',marginTop:20,backgroundColor: isDarkMode ? '#191919' : 'lightgray'}}>
<FontAwesome name="star" size={30} color='gray' style={{position:'relative',top:20}}/>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'gray',position:'relative',bottom:10}}>Themes</Text>
</View>
</TouchableOpacity>
<TouchableOpacity onPress={handleAsisteceScreenSelection}>
<View style={{paddingLeft:30,height:70,width:300,backgroundColor:'lightgray',borderRadius:30,alignSelf:'center',marginTop:20,backgroundColor: isDarkMode ? '#191919' : 'lightgray'}}>
<FontAwesome name="question" size={30} color='gray' style={{position:'relative',top:20}}/>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'gray',position:'relative',bottom:10}}>Assistance</Text>
</View>
</TouchableOpacity>
<TouchableOpacity onPress={handlFeedbadScreenSelection}>
<View style={{paddingLeft:30,height:70,width:300,backgroundColor:'lightgray',borderRadius:30,alignSelf:'center',marginTop:20,backgroundColor: isDarkMode ? '#191919' : 'lightgray'}}>
<FontAwesome name="comment" size={30} color='gray' style={{position:'relative',top:20}}/>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'gray',position:'relative',bottom:10}}>Feedback</Text>
</View>
</TouchableOpacity>
<TouchableOpacity onPress={handleSingout}>
<View style={{paddingLeft:30,height:70,width:300,borderRadius:30,alignSelf:'center',marginTop:20,backgroundColor: isDarkMode ? '#191919' : '#ff7b7b'}}>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'#ff5252',position:'relative',marginTop:20}}>Log out</Text>
</View>
</TouchableOpacity>
    </View>
    </ScrollView>
  );
}
