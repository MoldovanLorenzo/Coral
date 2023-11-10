import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
export default function GetStarted() {
  
  const navigation = useNavigation();
  const db = SQLite.openDatabase("CoralCache.db");
  useEffect(() => {
    const initializeDatabase = async () => {
      console.log('ENTERED INITIALIZE DATABASE LOGIC')
      db.transaction(tx => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS chatroom (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, language TEXT NOT NULL, photo TEXT);",
          [],
          () => { console.log("Created chatroom table"); },
          error => { console.log("Error creating chatroom table", error); }
        );
    
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS message (id TEXT PRIMARY KEY NOT NULL,content TEXT NOT NULL,local_sender INTEGER NOT NULL,chatroom_id TEXT NOT NULL,timestamp TEXT NOT NULL,FOREIGN KEY (chatroom_id) REFERENCES chatroom (id));",
          [],
          () => { console.log("Created message table"); },
          error => { console.log("Error creating message table", error); }
        );
      });
    }
    const checkAuthToken = async () => {
      try {
        const authToken = await AsyncStorage.getItem('auth_token');
        if (authToken) {
          navigation.navigate('Home',{fetchFlag:true});
          return;
        }
      } catch (error) {
        console.error('Eroare la verificarea token-ului:', error);
      }
    };
    initializeDatabase().then(()=>{checkAuthToken();});
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
