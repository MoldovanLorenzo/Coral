import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SocketProvider, useSocket } from '../hooks/socketInstance';
import { useNavigation } from '@react-navigation/native';

const FriendChat = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const MESSAGE_STORAGE_KEY = 'messages';
  const navigation = useNavigation();
  const socket = useSocket();
  
  const chatroom_id = route.params.friend.chatroom_id;
  const saveMessages = async (messages) => {
    try {
      const jsonString = JSON.stringify(messages);
      await AsyncStorage.setItem(MESSAGE_STORAGE_KEY, jsonString);
    } catch (error) {
      console.error('AsyncStorage Error: ' + error.message);
    }
  };

  const loadMessages = async () => {
    try {
      const jsonString = await AsyncStorage.getItem(MESSAGE_STORAGE_KEY);
      const loadedMessages = jsonString != null ? JSON.parse(jsonString) : [];
      setMessages(loadedMessages);
    } catch (error) {
      console.error('AsyncStorage Error: ' + error.message);
    }
  };
  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      console.log('Sending message: ' + newMessage + ' to chatroom of id: ' + chatroom_id);
      socket.emit('message', {
        message: newMessage,
        room: "main_room",
      });
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, { text: newMessage }];
        saveMessages(updatedMessages); 
        return updatedMessages;
      });
      setNewMessage('');
    }
  };
  
  const GOOGLE_TRANSLATE_API_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDXPwhS9mv0If+s\nIXPFis+Bnk9IhI9RlGhcEdDOsBXzXJhnhrQUCa1M0K7FDk0EOPZqIqEpmnU+EHGy\nG4ja/zzherBdyPUhHMHcxOw4Xtu6cyFolYPV6zRe4wqlEBNkBOFReWtdpn2Nza+N\ngJ8pbfzIcGb1npLRXQpLGalu6lNNCrxksWKVudl45GOy+IEAu3NHGmJulZQoy9RX\nNyFUX1qbvBT6LM/5vub0kX5Ap3FUX3C+WbiegTyMuflgkAzlPuybK7AEuK3gJkfe\nP+pnkyuXvtbe3k9Un9W6+XVaro+yfbXpau+2NU5bLeO2C4rpuCjsTC6s8CU7bdg6\nApebKoo5AgMBAAECggEACczs7BocQDlsEsJTKyNu30/9/CdM/0HqnoaRI1gRJ8uH\nhO81M9Rc96poysAj8ZVGYv7Ap8xImlLVWm62hIIqm3miniKQRrmwegTdXJO1HYAw\nfTqRjiPvdoKP8YQR3fP67mLA6Lqz7Mj4vVCl7pT7dYToqzZVKQM7fL/mXw58TH2j\nPKKA5ycFMpEHoY9En6bJ9DCGfm+48r4N3eAk3ipHER36BAo5OKKI6VIUVpb+CsQE\nFWo++UHeItGOWrFp0weFBqSNLUkuQ4VIcvjIMP+IpvmtSmWcMd7JMd1d/V8mF024\naqPliZCoDrvp1aemKPSSD/s0UZHO62pAK2ZOTdksAQKBgQD41SyLDCSNHjCIHUkc\nPYPKp7LIdMjIiYov1SprMLVTxSy/ICcw7UafpTGNErfv4Q3Uo3WMsf1iZhxfAJEW\nRY47Pg570aAhG/xDj0fPZGGpvy8nUOieyM784i1croCvap2ckiC1J1iAElowHVB1\nYVke1QWme6FgHZ/pTwuprdO6SQKBgQDdcjNhWNxNl0Bdw8Nz9FcXjVj1WKqIJoxm\nZsRpam3eDbg/B6Rl1p01IoHF4idjGetyHcen2TnH53/9hyLzf1FJ4tAB8Km/JrDh\n+GLmsuqshrBDc6FkaI6yW1KhBEZJa+x6FQhTe8zhjc4pgqQbqGT1HFB1QJFNP1WE\nvRyH/orQcQKBgAUCDVZzFR09+U4UAM+vsUJX47JDH3NhyUUzLhpgLZYVBtSF6iQC\n8oPuCDRFpywNxIB+FbSSNH5RfcqvsTvYhIdOtW3qhyWDca1OaeyToZ+P+Hv7FeN0\nOS4/wxf1byOYqrlm+3+J3i8dr3D+dgsWvXtwYB+8pz/O+NPyQlLU68j5AoGBANoU\npm7/EO5EvznYGbsu7ToflHUCnea5d9k86b8a9hoRjtpbz1YPdgCm/ACCCOH627kl\nhMNTFSk+XfiyxgPg5ZALE2hltvWtx9KyR8wEdUH03s9+p3l30tfpQcWarRGPfHJ6\nFhoJOKsEePy+UJmAS/RrrvzZ2n6lmbXAe8GeNtyxAoGAfR4aTTR/faQ6CQtqY35G\nZ6QCtHqyBiPFyUT1L8mYpZsqkcDV8EW51lXFJVJJtT5ObObGVYCQUJZ/q/IhfcdC\nYh4Kq2Kd8/3TENb9rAO/lU9og2Vy2a8FSdE93541kF+1i4rRCG1JRawPRWAtVMKo\nSdsnCQY+cWDRRxiykzlcB0k=\n-----END PRIVATE KEY-----\n";
  const translateText = async (text, targetLanguage) => {
      try {
        console.log("now translating text: "+text)
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'application/gzip',
            'X-Goog-Api-Key': GOOGLE_TRANSLATE_API_KEY,
          },
          body: JSON.stringify({
            q: text,
            target: targetLanguage,
          }),
        });
    
        const responseJson = await response.json();
    
        if (responseJson.data && responseJson.data.translations) {
          const translatedText = responseJson.data.translations[0].translatedText;
          console.log('Translated text:', translatedText);
          return translatedText;
        } else {
          console.log('Translation failed', responseJson);
          return text; 
        }
      } catch (error) {
        console.error('Error translating text:', error);
        return text; 
      }
    };
    useEffect(() => {
      socket.on('user_message', (data) => {
        translateText(data.message, 'es').then(translatedText => {
          console.log('The translation is:', translatedText);
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, { text: translatedText }];
            saveMessages(updatedMessages); 
            return updatedMessages;
          });
        });
      });
      try{
        console.log('Loading messagess..')
        loadMessages();
      }catch{
        console.log('Failed loading messages from storage!')
      }
      return () => {
        socket.off('user_message');
      };
    }, [socket]);

  return (
    <View style={{ flex: 1 }}>
        <View style={{flexDirection: 'row', alignItems: 'center',justifyContent:'space-between',padding:30}}>
        <TouchableOpacity>
        <FontAwesome name="angle-left" size={30} color="#ff9a00" />
        </TouchableOpacity>
        <Text>nume</Text>
        <TouchableOpacity>
        <FontAwesome name="bars" size={24} color="#ff9a00" />
        </TouchableOpacity>
        </View>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ padding: 10, backgroundColor: 'lightgray', marginVertical: 5 }}>
              <Text>{item.text}</Text>
            </View>
          )}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={{ flex: 1, height: 50, borderColor: 'gray', borderWidth: 1, margin: 5, borderRadius:25,paddingLeft:15 }}
          onChangeText={(text) => setNewMessage(text)}
          value={newMessage}
          placeholder="Introduceți un mesaj..."
          />
          <TouchableOpacity
            style={{ backgroundColor: '#ff9a00', padding: 10, margin: 5, borderRadius: 25}}
            onPress={sendMessage}
          >
            <FontAwesome name="paper-plane" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
  );
};

export default FriendChat;