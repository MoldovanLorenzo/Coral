import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable,ScrollView  } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalDropdown from "react-native-modal-dropdown";
import Flag from "react-native-flags";

export default function Language({ isDarkMode }) {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState("Select your language:");
  const [defaultLanguage, setDefaultLanguage] = useState("Select your language:"); // Adăugat un nou stadiu pentru valoarea implicită a limbii
  const countries = ["English", "Spanish","Bulgarian","Chinese",'Czech','Danish', 'Dutch', 'Estonian','Finnish','French','German', 'Greek','Hungarian', 'Indonesian', 'Italian','Japanese','Korean', 'Latvian','Lithuanian','Norwegian','Polish','Portuguese','Romanian', 'Russian','Slovak','Slovenian','Swedish','Turkish','Ukrainian'];

  const [selectedStates, setSelectedStates] = useState(Array(countries.length).fill(false));

  const CustomIndicator = ({ selected }) => (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#191919',
        backgroundColor:  selected ? 'black' : 'white',
        borderBlockColor : '#191919',
        marginLeft: 10,
      }}
    />
  );

  const [isSelected, setSelection] = useState(false);

  const handleCountryChange = (value) => {
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

  const handleSettingsSelection = () => {
    navigation.navigate('Settings');
  }

  return (
    <ScrollView>
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#191919' : 'white' }}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',padding:30}}>
        <TouchableOpacity onPress={handleSettingsSelection} style={{alignSelft:'flex-start'}}>
        <FontAwesome name="angle-left" size={34} color="#ff9a00" />
        </TouchableOpacity>
        <Text style={{fontWeight: 'bold', color: isDarkMode ? 'white' : 'black',fontSize:20}}>Language</Text>
        <TouchableOpacity><Text style={{color: isDarkMode ? '#191919' : 'white'}}>...</Text></TouchableOpacity>
      </View>

       <View
       style={{
        backgroundColor: isDarkMode ? '#ff9a00' : 'lightgray',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Text style={{ color: isDarkMode ? 'white' : 'black', padding: 10}}>Current language is: {selectedLanguage}</Text>
      </View>
      <View
      style={{
        backgroundColor: isDarkMode ? '#ff9a00' : 'lightgray',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Text>Change language:</Text>
      </View>
      <View>
        {countries.map((country) => (
          <Pressable
            key={country}
            onPress={() => {
              handleCountryChange(country);
              setSelectedStates(prevStates => {
                const newStates = [...prevStates];
                newStates[countries.indexOf(country)] = !prevStates[countries.indexOf(country)];
                return newStates;
              });
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: isDarkMode ? 'white' : 'black', padding: 10 }}>{country}</Text>
              <Flag
                code={getCountryCode(country)}
                size={32}
              />
              <CustomIndicator selected={selectedStates[countries.indexOf(country)]} />

            </View>
          </Pressable>
        ))}
      </View>
    </View>
    </ScrollView>
  );
} 

const getCountryCode = (country) => {
  if (country === "English") {
    return "GB";
  } else if (country === "Spanish") {
    return "ES";
  } else if (country === "Bulgarian") {
    return "BG";
  } else if (country === "Chinese") {
    return "CN";
  } else if (country === "Czech") {
    return "CZ";
  } else if (country === "Danish") {
    return "DK";
  } else if (country === "Dutch") {
    return "NL";
  } else if (country === "Estonian") {
    return "EE";
  } else if (country === "Finnish") {
    return "FI";
  } else if (country === "French") {
    return "FR";
  } else if (country === "German") {
    return "DE";
  } else if (country === "Greek") {
    return "GR";
  } else if (country === "Hungarian") {
    return "HU";
  } else if (country === "Indonesian") {
    return "ID";
  } else if (country === "Italian") {
    return "IT";
  } else if (country === "Japanese") {
    return "JP";
  } else if (country === "Korean") {
    return "KR";
  } else if (country === "Latvian") {
    return "LV";
  } else if (country === "Lithuanian") {
    return "LT";
  } else if (country === "Norwegian") {
    return "NO";
  } else if (country === "Polish") {
    return "PL";
  } else if (country === "Portuguese") {
    return "PT";
  } else if (country === "Romanian") {
    return "RO";
  } else if (country === "Russian") {
    return "RU";
  } else if (country === "Slovak") {
    return "SK";
  } else if (country === "Slovenian") {
    return "SI";
  } else if (country === "Swedish") {
    return "SE";
  } else if (country === "Turkish") {
    return "TR";
  } else if (country === "Ukrainian") {
    return "UA";
  }
   
};