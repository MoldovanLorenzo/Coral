import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GetStarted() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const authToken = await AsyncStorage.getItem('auth_token');
        if (authToken) {
          navigation.navigate('Home');
          return;
        }
      } catch (error) {
        console.error('Eroare la verificarea token-ului:', error);
      }
    };

    checkAuthToken();
  }, [navigation]);

  const handleSingupSelection = () => {
    navigation.navigate('Singup');
  };

  return (
    <View style={{ backgroundColor: '#ff9a00', flex: 1 }}>
      <Text style={{ fontSize: 25, textAlign: 'center', color: 'white', marginBottom: 0, position: 'relative', top: 100, padding: 20, fontStyle: 'italic' }}>
        ChatLingo is a revolutionary chat application designed to bridge communication gaps by instantly translating messages into the recipient's native language.
      </Text>
      <TouchableOpacity onPress={handleSingupSelection} style={{ alignSelf: 'center', position: 'relative', top: 150, borderColor: 'white', borderWidth: 3, paddingTop: 10, paddingBottom: 10, paddingLeft: 30, paddingRight: 30, borderRadius: 50, marginTop: 0 }}>
        <Text style={{ fontSize: 30, color: 'white' }}>Get started!</Text>
      </TouchableOpacity>
    </View>
  );
}
