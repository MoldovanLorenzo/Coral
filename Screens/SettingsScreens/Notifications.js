import React from "react";
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function Notifications()
{
const navigation = useNavigation();
const handleSettingsSelection= () => {
    navigation.navigate('Settings');
  }
return(
    <View style={{ flex: 1 }}>
        <View style={{padding:20}}></View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16,marginBottom:30 }}>
        <TouchableOpacity onPress={handleSettingsSelection}>
          <FontAwesome name="angle-left" size={34} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 25 }}>Notifications</Text>
        <View style={{ width: 24 }}></View>
      </View>
      <View style={{backgroundColor:'lightgray',padding:40,margin:10,borderRadius:10}}></View>
      </View>
);

}