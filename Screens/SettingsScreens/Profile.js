import React from "react";
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
    const navigation = useNavigation();
    const handleSettingsSelection= () => {
        navigation.navigate('Settings');
      }
  return (
    <View style={{ flex: 1 }}>
        <View style={{padding:20}}></View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16 }}>
        <TouchableOpacity onPress={handleSettingsSelection}>
          <FontAwesome name="angle-left" size={34} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 30 }}>Profile</Text>
        <View style={{ width: 24 }}></View>
      </View>
      <TouchableOpacity>
        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <View style={{ width: 120, height: 120, backgroundColor: 'black', borderRadius: 60, alignSelf: 'center' }}></View>
        </View>
      </TouchableOpacity>
      <View style={{ marginHorizontal: 16, marginTop: 20 }}>
        <TextInput
          placeholder="Email actual"
          style={{ borderWidth: 2, borderColor: 'lightgray', padding: 10 }}
        />
      </View>
      <View style={{ marginHorizontal: 16, marginTop: 20 }}>
        <TextInput
          placeholder="Username actual"
          style={{ borderWidth: 2, borderColor: 'lightgray', padding: 10 }}
        />
      </View>
      <View style={{ marginHorizontal: 16, marginTop: 20 }}>
        <TextInput
          placeholder="Parola actuala"
          secureTextEntry={true}
          style={{ borderWidth: 2, borderColor: 'lightgray', padding: 10 }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
      </View>
    </View>
  );
}
