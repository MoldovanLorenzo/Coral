import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalDropdown from "react-native-modal-dropdown";

export default function Language({ isDarkMode }) {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState("Select your language:");
  const [defaultLanguage, setDefaultLanguage] = useState("Select your language:"); // Adăugat un nou stadiu pentru valoarea implicită a limbii
  const countries = ["English", "Spanish", "French","German","Italian","Chinese","Japanese","Korean","Arabic","Portuguese"];

  const handleCountryChange = (index, value) => {
    setSelectedLanguage(value);
    updateUserData(value);
  };
  

  const updateUserData = async (language) => {
    const serverUrl = "https://copper-pattern-402806.ew.r.appspot.com/chatrooms";
    try {
      const auth_token = await AsyncStorage.getItem('auth_token');
      const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth_token,
        },
        body: JSON.stringify({
          what: 'updateUser',
          new_email: 'null',
          new_language: language,
          new_pfp: 'null',
        }),
      });

      const responseData = await response.json();
      console.log("Response from server:", responseData);

      if (responseData.response === 'OK') {
        // Acțiunile după actualizarea cu succes
        // Updatează și AsyncStorage cu noua limbă selectată
        await AsyncStorage.setItem(`user_language`, language);
      }
    } catch (error) {
      console.error("Eroare de rețea:", error);
    }
  };

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        console.log("Trying to load language...");
        const auth_token = await AsyncStorage.getItem('auth_token');
        const user_language = await AsyncStorage.getItem(`user_language`);
        console.log("Stored Language from AsyncStorage:", user_language);
    
        if (!user_language) {
          console.log("No language stored.");
        } else {
          setSelectedLanguage(user_language);
          setDefaultLanguage(user_language);
        }
      } catch (error) {
        console.error("Error loading language:", error);
      }
    };
    

    // La montarea componentei, încarcă limba
    loadLanguage();
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#191919' : 'white' }}>
      <View style={{ alignItems: 'center', justifyContent: 'space-between', padding: 30 }}>
        <Text style={{ color: isDarkMode ? 'white' : 'black' }}>Limba curentă este: {selectedLanguage}</Text>
        <ModalDropdown
          options={countries}
          onSelect={(index, value) => handleCountryChange(index, value)}
          defaultValue={defaultLanguage} // Folosește valoarea implicită a limbii pentru defaultValue
          style={{ margin: 10, alignSelf: 'center' }}
        />
      </View>
    </View>
  );
}
