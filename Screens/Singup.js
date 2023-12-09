import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { useNavigation } from '@react-navigation/native';
import Flag from 'react-native-flags';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from "../config/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc,setDoc } from "firebase/firestore"
export default function Singup() {
  const navigation = useNavigation();
  const auth= FIREBASE_AUTH;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState('');
  const [countries, setCountries] = useState([
    { label: 'Spanish', code: 'ES' },
    { label: 'English', code: 'GB' },
    { label: 'Bulgarian', code: 'BG' },
    { label: 'Chinese', code: 'CN' },
    { label: 'Czech', code: 'CZ' },
    { label: 'Danish', code: 'DK' },
    { label: 'Dutch', code: 'NL' },
    { label: 'Estonian', code: 'EE' },
    { label: 'Finnish', code: 'FI' },
    { label: 'French', code: 'FR' },
    { label: 'German', code: 'DE' },
    { label: 'Greek', code: 'GR' },
    { label: 'Hungarian', code: 'HU' },
    { label: 'Indonesian', code: 'ID' },
    { label: 'Italian', code: 'IT' },
    { label: 'Japanese', code: 'JP' },
    { label: 'Korean', code: 'KR' },
    { label: 'Latvian', code: 'LV' },
    { label: 'Lithuanian', code: 'LT' },
    { label: 'Norwegian', code: 'NO' },
    { label: 'Polish', code: 'PL' },
    { label: 'Portuguese', code: 'PT' },
    { label: 'Romanian', code: 'RO' },
    { label: 'Russian', code: 'RU' },
    { label: 'Slovak', code: 'SK' },
    { label: 'Slovenian', code: 'SI' },
    { label: 'Swedish', code: 'SE' },
    { label: 'Turkish', code: 'TR' },
    { label: 'Ukrainian', code: 'UA' },
  ]);
  const handleSingup = async () => {
    try{
      const response = await createUserWithEmailAndPassword(auth,email,password)
      const user= response.user;
      await updateProfile(user,{
        displayName:username,
      })
      const usersCollection = collection(FIREBASE_FIRESTORE, 'users');
      const userDocRef = doc(usersCollection, user.uid);

       await setDoc(userDocRef, {
  email: user.email,
  displayName: user.displayName,
  language: selectedCountry.code
});
      navigation.navigate('Login');
    }catch(error){
       console.log(error)
       alert('Error during signup! '+ error.message);
    }
  };
  

  const handleCountryChange = (index, value) => {
    setSelectedCountry(value);
    console.log('Just set selected country to:')
    console.log(selectedCountry)
  };
  const renderDropdownRow = (country, index, isSelected) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Flag code={country.code} size={16} style={{ marginRight: 10 }} />
        <Text>{country.label}</Text>
      </View>
    );
  };
  const renderSelectedValue = () => {
    if (selectedCountry) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Flag code={selectedCountry.code} size={16} style={{ marginRight: 10 }} />
          <Text>{selectedCountry.label}</Text>
        </View>
      );
    } else {
      return <Text>Select a language</Text>;
    }
  };
  const renderTextForOption = (option) => {
    return option.label; 
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#ff9a00' }}>
      <View style={{
        backgroundColor: "white",
        height: 530,
        width: 320,
        alignSelf: 'center',
        marginTop: 110,
        borderRadius: 30,
        
      }}>
        <Text style={{
          alignSelf: 'center',
          fontSize: 40,
          fontWeight: 'bold',
          marginTop: 30,
        }}>
          Sign up
        </Text>
        <TextInput 
  placeholder="Email" 
  style={{ padding:5, borderBottomWidth: 1, borderBottomColor: 'gray', margin: 20 }} 
  onChangeText={(text) => setEmail(text)} 
  value={email}
/>
<TextInput 
  placeholder="Username" 
  style={{ padding:5, borderBottomWidth: 1, borderBottomColor: 'gray', margin: 20 }} 
  onChangeText={(text) => setUsername(text)} 
  value={username} 
/>
<TextInput 
  placeholder="Password" 
  style={{ padding: 0, borderBottomWidth: 1, borderBottomColor: 'gray', margin: 20 }} 
  onChangeText={(text) => setPassword(text)} 
  value={password} 
/>
<ModalDropdown
        options={countries}
        onSelect={handleCountryChange}
        defaultValue={"Select a value"}
        renderRow={renderDropdownRow}
        renderButtonText={renderTextForOption}
        style={{ margin: 10, alignSelf: 'center' }}
      />
        {error !== '' && ( 
        <Text style={{ color: 'red', fontWeight: 'bold', marginTop: 10 }}>
          {error}
        </Text>
         )}
        <TouchableOpacity onPress={()=>handleSingup()} style={{alignSelf:'center',backgroundColor:'#ff9a00',paddingVertical:15,paddingHorizontal:60,borderRadius:10,marginTop:40}}>
          <Text>Sign up</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
  <Text style={{ marginRight: 5 }}>Already signed up?</Text>
  <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
    <Text style={{ color: '#ff9a00' }}>Login</Text>
  </TouchableOpacity>
</View>
      </View>
    </View>
  );
}
