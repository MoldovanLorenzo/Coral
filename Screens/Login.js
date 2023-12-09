import React, { useState, useEffect } from "react";
import { setTranslations } from '../hooks/translationContext';
import { useRoute } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH,FIREBASE_FIRESTORE, FIREBASE_TOKEN } from "../config/firebase"
import { collection, doc,getDoc } from "firebase/firestore"
import { useTranslations } from '../hooks/translationContext';
import { signInWithEmailAndPassword } from "firebase/auth";
import { TranslationProvider } from "../hooks/translationContext";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const auth= FIREBASE_AUTH;
  const navigation = useNavigation();
  const route = useRoute();
  const message = route.params?.message;
  const { translations, updateTranslations } = useTranslations();
  const translateText = async (toTranslate, targetLanguage) => {
    const url = 'https://api-free.deepl.com/v2/translate';
    const authKey = '5528c6fd-705c-5784-afd2-edba369cb1d9:fx'; 
    const adjustedTargetLanguage = targetLanguage === 'GB' ? 'EN' : targetLanguage;
    const requestBody = {
      text: [toTranslate],
      target_lang: adjustedTargetLanguage,
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${authKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error during translation:', error);
      throw error; 
    }
  };
  const handleLogin = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, username, password);
      const user = response.user;
      const usersCollection = collection(FIREBASE_FIRESTORE, 'users');
      const userDocRef = doc(usersCollection, user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      console.log(FIREBASE_TOKEN);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const userLanguage = userData.language;
        const photo= userData.user_photo;
        await AsyncStorage.setItem('user_username', user.displayName);
        await AsyncStorage.setItem('user_id', user.uid);
        const currentLanguage= await AsyncStorage.getItem('user_language');
        //Mai incolo se pot hardcoda frumos traducerile (se pot = ar trebuii obligatoriu, sa nu platim ca prostii la api), eventual citite dintr-un fisier
        if(currentLanguage != userLanguage || currentLanguage==null){
          if(userLanguage=='GB'){
            updateTranslations({
              "HSFriends":"Friends",
              "HSChatroom":"Chat rooms",
              "FFTop":"Add Friends",
              "FFTooltip":"Search Friends",
              "FRTop":"Friend requests",
              "CHTooltip":"Input message here...",
              "STLanguage": "Language",
              "STFeedback": "Feedback",
              "STThemes": "Themes",
              "STTop":"Settings",
              "STAssistance": "Assistance",
              "STLogout":"Logout"
           })
          }else{
            updateTranslations({
              "HSFriends":await translateText("Friends",userLanguage),
              "HSChatroom":await translateText("Chat rooms",userLanguage),
              "FFTop":await translateText("Add Friends",userLanguage),
              "FFTooltip":await translateText("Search Friends",userLanguage),
              "FRTop":await translateText("Friend requests",userLanguage),
              "CHTooltip":await translateText("Input message here...",userLanguage),
              "STLanguage": await translateText("Language",userLanguage),
              "STFeedback": await translateText("Feedback",userLanguage),
              "STTop": await translateText("Settings",userLanguage),
              "STThemes": await translateText("Themes",userLanguage),
              "STAssistance": await translateText("Assistance",userLanguage),
              "STLogout": await translateText("Logout",userLanguage)
           })
          }
          
          await AsyncStorage.setItem('user_language', userLanguage);
        }
        
        if(userData.user_photo){
          await AsyncStorage.setItem('user_photo',photo);
        }else{
          await AsyncStorage.removeItem('user_photo');
        }
        
        navigation.navigate('Home', { fetchFlag: true });
      } else {
        alert('User data not found');
      }
    } catch (error) {
      console.log(error);
      alert('Login failed! ' + error.message);
    }
  };
  
  

  return (
    <TranslationProvider>
    <View style={{ flex: 1, backgroundColor: "#ff9a00" }}>
      <View
        style={{
          backgroundColor: "white",
          height: 500,
          width: 320,
          alignSelf: "center",
          marginTop: 130,
          borderRadius: 30,
          
        }}
      >
        <Text
          style={{
            alignSelf: "center",
            fontSize: 40,
            fontWeight: "bold",
            marginTop: 30,
          }}
        >
          Log in
        </Text>
        <TextInput
          placeholder="Username"
          style={{
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: "gray",
            margin: 20,
          }}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
  placeholder="Password"
  style={{
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    margin: 20,
  }}
  onChangeText={(text) => setPassword(text)}
  secureTextEntry 
/>
        {message && (
        <Text style={{ color: 'red', margin: 20, alignSelf: 'center' }}>
          {message}
        </Text>
      )}
        <TouchableOpacity onPress={handleLogin} style={{alignSelf:'center',backgroundColor:'#ff9a00',paddingVertical:15,paddingHorizontal:60,borderRadius:10,marginTop:40}}>
          <Text>Login</Text>
        </TouchableOpacity>
        <View style={{alignSelf:'center', marginTop:20}}>
        <Text style={{ color: 'black' }}>
          No account?{' '}
          <Text
            style={{ color: '#ff9a00' }}
            onPress={() => navigation.navigate('Singup')}
          >
            Sign up
          </Text>
        </Text>
       </View>
      </View>
    </View>
    </TranslationProvider>
  );
}
