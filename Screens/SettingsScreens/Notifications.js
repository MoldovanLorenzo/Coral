import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function Notifications() {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  }

  const handleSettingsSelection = () => {
    navigation.navigate('Settings');
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 20 }}></View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, marginBottom: 30 }}>
        <TouchableOpacity onPress={handleSettingsSelection}>
          <FontAwesome name="angle-left" size={34} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 25 }}>Notifications</Text>
        <View style={{ width: 24 }}></View>
      </View>
      <View style={{ backgroundColor: 'lightgray', padding: 10, margin: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
  <Text style={{ padding: 0, alignSelf: 'flex-start', paddingVertical: 10,fontWeight:'bold' }}>Notifications</Text>
  <Switch
    style={{ alignSelf: 'flex-end' }}
    trackColor={{ false: '#767577', true: '#FFC100' }}
    thumbColor={isEnabled ? '#ff9a00' : '#f4f3f4'}
    ios_backgroundColor="#3e3e3e"
    onValueChange={toggleSwitch}
    value={isEnabled}
  />
</View>
    </View>
  );
}
