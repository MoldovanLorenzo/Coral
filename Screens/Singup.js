import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { useNavigation } from '@react-navigation/native';
import Login from "./Login";
import HomeScreen from "./HomeScreen";

export default function Singup() {
  const navigation = useNavigation();
    const handleLoginSelection = () => {
        navigation.navigate('Login');
      };
      const handleHomeScreenSelection =()=> {
        navigation.navigate('Home')
      };
  const [email, setEmail]=useState("")
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleSingup = () => {
    const serverUrl = "http://simondarius.pythonanywhere.com/signup";

    const data = {
      email: email,
      username: username,
      password: password,
      language: selectedCountry,
    };

    fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Răspuns de la server:", responseData);

      })
      .catch((error) => {
        console.error("Eroare de rețea:", error);
      });
  };

  const functieApelare = () =>{
handleSingup();
handleHomeScreenSelection();
  };

  const countries = ["Select your language:","English", "Spanish", "French","German","Italian","Chinese","Japanese","Korean","Arabic","Portugese"];
  const handleCountryChange = (index, value) => {
    setSelectedCountry(value);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ff9a00' }}>
      <View style={{
        backgroundColor: "white",
        height: 500,
        width: 320,
        alignSelf: 'center',
        marginTop: 110,
        borderRadius: 30,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}>
        <Text style={{
          alignSelf: 'center',
          fontSize: 40,
          fontWeight: 'bold',
          marginTop: 30,
        }}>
          Sign up
        </Text>
        <TextInput placeholder="Email" style={{ padding:5, borderBottomWidth: 1, borderBottomColor: 'gray', margin: 20 }} />
        <TextInput placeholder="Username" style={{ padding:5, borderBottomWidth: 1, borderBottomColor: 'gray', margin: 20 }} />
        <TextInput placeholder="Password" style={{ padding: 0, borderBottomWidth: 1, borderBottomColor: 'gray', margin: 20 }} />
        <ModalDropdown
          options={countries}
          onSelect={handleCountryChange}
          defaultValue="Select a language"
          style={{ margin: 10,alignSelf:'center' }}
        />

        <TouchableOpacity onPress={functieApelare} style={{alignSelf:'center',backgroundColor:'#ff9a00',paddingVertical:15,paddingHorizontal:60,borderRadius:10,marginTop:40}}>
          <Text>Sign up</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
  <Text style={{ marginRight: 5 }}>Already signed up?</Text>
  <TouchableOpacity onPress={handleLoginSelection }>
    <Text style={{ color: '#ff9a00' }}>Login</Text>
  </TouchableOpacity>
</View>
      </View>
    </View>
  );
}
