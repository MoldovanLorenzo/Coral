import React, { useState, useEffect } from "react";
import { useRoute } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const message = route.params?.message;
  const handleLogin = () => {
    const serverUrl = "https://copper-pattern-402806.ew.r.appspot.com/login";
    
    const data = {
      username: username,
      password: password,
    };

    fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log("Răspuns de la server:", responseData);

        if (responseData.response === "OK" && responseData.auth_token) {
          console.log(responseData.auth_token);
          setInfo=async () =>{
            await AsyncStorage.setItem("auth_token", responseData.auth_token)
            await AsyncStorage.setItem("user_username",responseData.username)
            await AsyncStorage.setItem("user_language",responseData.preffered_language)
            await AsyncStorage.setItem("user_id",responseData.id)
            if(responseData.user_image!=null){
            await AsyncStorage.setItem("user_photo",responseData.user_image)
            }
          }
          setInfo().then(()=>{navigation.navigate('Home');})
        } else {
          setError("Eroare la autentificare. Verificați datele introduse.");
        }
      })
      .catch((error) => {
        console.error("Eroare de rețea:", error);
      });
  };

  return (
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
  );
}
