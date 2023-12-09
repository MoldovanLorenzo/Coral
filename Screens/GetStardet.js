import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
async function requestNotificationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS, 
      {
        title: 'Notification Permission',
        message: 'Allow this app to send you notifications.',
        buttonPositive: 'OK',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission granted');
      const fcmToken = await messaging().getToken();
       if (fcmToken) {
       console.log('FCM Token:', fcmToken);
       } else {
       console.log('No FCM token received');
      }
    } else {
      console.log('Notification permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

export default function GetStarted() {
  
  const navigation = useNavigation();
  
  useEffect(() => {
    
    
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
