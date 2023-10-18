import React from "react";
import { View, Text, Switch, TouchableOpacity} from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function Themes({ isDarkMode, setIsDarkMode }) {
  const navigation = useNavigation();
  const toggleSwitch = () => {
    setIsDarkMode((previousState) => !previousState);
  }
  const handleSettingsSelection = () => {
    navigation.navigate('Settings');
  }

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#191919' : 'white' }}>
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',padding:30}}>
    <TouchableOpacity onPress={handleSettingsSelection} style={{alignSelft:'flex-start'}}>
    <FontAwesome name="angle-left" size={34} color="#ff9a00" />
  </TouchableOpacity>
    <Text style={{fontWeight: 'bold', color: isDarkMode ? 'white' : 'black',fontSize:20,}}>Themes</Text>
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
        }}
      >
        <Text style={{ padding: 0, alignSelf: 'flex-start', paddingVertical: 10, fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' }}>
          Dark mode
        </Text>
        <Switch
          style={{ alignSelf: 'flex-end' }}
          trackColor={{ false: '#767577', true: '#FFC100' }}
          thumbColor={isDarkMode ? '#ff9a00' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isDarkMode}
        />
      </View>
    </View>
  );
}
