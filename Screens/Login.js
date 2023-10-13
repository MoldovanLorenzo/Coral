import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    const serverUrl = "http://simondarius.pythonanywhere.com/login";

    const data = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.response === "OK" && responseData.auth_token) {
        console.log(responseData);
        await AsyncStorage.setItem("authToken", responseData.auth_token);
        navigation.navigate('Home');
      } else {
        setError("Eroare la autentificare. Verificați datele introduse.");
      }
    } catch (error) {
      console.error("Eroare de rețea:", error);
    }
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
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
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
        />
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            alignSelf: 'center',
            backgroundColor: '#ff9a00',
            paddingVertical: 15,
            paddingHorizontal: 60,
            borderRadius: 10,
            marginTop: 40,
          }}
        >
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
