import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView,Image, Linking} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { TranslationProvider, useTranslations } from '../hooks/translationContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from "../config/firebase"
export default function Settings({ isDarkMode, setIsDarkMode }) {
  const [username, setUsername] = useState('');
  const [photo, setPhoto] = useState(null);
  const usersCollection = collection(FIREBASE_FIRESTORE, 'users');
  const cached_ui=useTranslations();
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

  if (!result.canceled) {
    console.log(result.uri);
    const userPhotoBase64 = result.base64; 

    try {
        const userID = await AsyncStorage.getItem('user_id');
        const userDocRef = doc(usersCollection, userID);
        await updateDoc(userDocRef, {
            photo: userPhotoBase64, 
        });
        await AsyncStorage.setItem('user_photo',userPhotoBase64);
        setPhoto(userPhotoBase64);
        alert('Photo changed successfully!');
    } catch (error) {
        alert('Error updating user photo:', error);
    }
    
};
}


  const handleAsisteceScreenSelection = () => {
    const supportEmail = 'coralsuport@gmail.com';

     // Construiește subiectul și corpul e-mailului
     const subject = 'Cerere de asistență';
     const body = 'Salut, \n\nVreau să solicit asistență cu privire la următoarea problemă: ';

     // Construiește adresa URL pentru deschiderea aplicației de e-mail cu e-mailul pregătit
     const emailUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

     // Deschide adresa URL utilizând funcția Linking.openURL
     Linking.openURL(emailUrl)
    .catch((err) => console.error('Nu s-a putut deschide aplicația de e-mail:', err));
  };
  const handlFeedbadScreenSelection = () => {
    const storeUrl = Platform.OS === 'android'
    ? 'https://play.google.com/store/apps/details?id=com.tedious.app'
    : 'https://apps.apple.com/us/app/tedious/id1234567890';  // înlocuiește cu Bundle ID-ul real al aplicației tale

  // Deschide URL-ul utilizând funcția Linking.openURL
     Linking.openURL(storeUrl)
    .catch((err) => console.error('Nu s-a putut deschide URL-ul:', err));
  };
  const handleLanguageScreenSelection = () => {
    navigation.navigate('Language');
  };
  /*const handleNotificationsScreenSelection = () => {
    navigation.navigate('Notifications');
  };*/
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
    <TranslationProvider>
    <ScrollView>
    <View style={{ flex: 1, flexDirection: 'column',backgroundColor: isDarkMode ? '#191919' : 'white' }}>
      <View style={{ alignSelf: 'center', height: 100, width: 450 }}>
        <Text style={{ alignSelf: 'center', position: 'relative', top: 50, fontWeight: 'bold', fontSize: 25,color: isDarkMode ? 'gray' : 'black'}}>{cached_ui && cached_ui['STTop'] ? cached_ui['STTop'] : 'Settings'}</Text>
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
 
<TouchableOpacity onPress={handleLanguageScreenSelection}>
<View style={{paddingLeft:30,height:70,width:300,borderRadius:30,alignSelf:'center',marginTop:20,backgroundColor: isDarkMode ? '#191919' : 'lightgray'}}>
<FontAwesome name="language" size={30} color='gray' style={{position:'relative',top:20}}/>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'gray',position:'relative',bottom:10}}>{cached_ui && cached_ui['STLanguage'] ? cached_ui['STLanguage'] : 'Language'}</Text>
</View>
</TouchableOpacity>
<TouchableOpacity onPress={handleThemesScreenSelection}>
<View style={{paddingLeft:30,height:70,width:300,backgroundColor:'lightgray',borderRadius:30,alignSelf:'center',marginTop:20,backgroundColor: isDarkMode ? '#191919' : 'lightgray'}}>
<FontAwesome name="star" size={30} color='gray' style={{position:'relative',top:20}}/>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'gray',position:'relative',bottom:10}}>{cached_ui && cached_ui['STThemes'] ? cached_ui['STThemes'] : 'Themes'}</Text>
</View>
</TouchableOpacity>
<TouchableOpacity onPress={handleAsisteceScreenSelection}>
<View style={{paddingLeft:30,height:70,width:300,backgroundColor:'lightgray',borderRadius:30,alignSelf:'center',marginTop:20,backgroundColor: isDarkMode ? '#191919' : 'lightgray'}}>
<FontAwesome name="question" size={30} color='gray' style={{position:'relative',top:20}}/>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'gray',position:'relative',bottom:10}}>{cached_ui && cached_ui['STAssistance'] ? cached_ui['STAssistance'] : 'Assistance'}</Text>
</View>
</TouchableOpacity>
<TouchableOpacity onPress={handlFeedbadScreenSelection}>
  <View style={{ paddingLeft: 30, height: 70, width: 300, backgroundColor: 'lightgray', borderRadius: 30, alignSelf: 'center', marginTop: 20, backgroundColor: isDarkMode ? '#191919' : 'lightgray' }}>
    <FontAwesome name="comment" size={30} color='gray' style={{ position: 'relative', top: 20 }} />
    <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold', color: 'gray', position: 'relative', bottom: 10 }}>{cached_ui && cached_ui['STFeedback'] ? cached_ui['STFeedback'] : 'Feedback'}</Text>
  </View>
</TouchableOpacity>
<TouchableOpacity onPress={handleSingout}>
<View style={{paddingLeft:30,height:70,width:300,borderRadius:30,alignSelf:'center',marginTop:20,backgroundColor: isDarkMode ? '#191919' : '#ff7b7b'}}>
<Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold',color:'#ff5252',position:'relative',marginTop:20}}>{cached_ui && cached_ui['STLogout'] ? cached_ui['STLogout'] : 'Logout'}</Text>
</View>
</TouchableOpacity>
    </View>
    </ScrollView>
    </TranslationProvider>
  );
}
