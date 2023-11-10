import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SocketProvider, useSocket } from '../hooks/socketInstance';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

const FriendChat = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigation = useNavigation();
  const socket = useSocket();
  const db = SQLite.openDatabase("CoralCache.db");
  const chatroom_id = route.params.friend.id;
  function generateUUID() {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
  const prepareMessages = (messages) => {
    const sortedMessages = messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const preparedMessages = [];
    let lastDate = null;
  
    sortedMessages.forEach((message) => {
      const messageDate = new Date(message.timestamp).toDateString();
      if (messageDate !== lastDate) {
        preparedMessages.push({ type: 'dateSeparator', date: messageDate });
        lastDate = messageDate;
      }
      preparedMessages.push(message);
    });
  
    return preparedMessages;
  };
  const saveMessage = (newMessage, local) => {
    return new Promise((resolve, reject) => {
      const mirroredMessage = {
        id: generateUUID(),
        content: newMessage,
        local_sender: local,
        chatroom_id: chatroom_id,
        timestamp: new Date().toISOString()
      };
      db.transaction(tx => {
        tx.executeSql(
          "INSERT INTO message (id, content, local_sender, chatroom_id, timestamp) VALUES (?, ?, ?, ?, ?);",
          [mirroredMessage.id, mirroredMessage.content, mirroredMessage.local_sender, mirroredMessage.chatroom_id, mirroredMessage.timestamp],
          () => {
            console.log("Message saved");
            resolve(mirroredMessage);
          },
          error => {
            console.error("Error saving message", error);
            reject(error);
          }
        );
      });
    });
  };
  
  
  const loadMessages = async () => {
    try {
      db.transaction(tx => {
        tx.executeSql(
          "SELECT * FROM message WHERE chatroom_id = ?;",
          [chatroom_id],
          (_, { rows }) => {
            console.log(rows._array)
            setMessages(rows._array);
          },
          error => { console.error("Error loading messages", error); }
        );
      });
    } catch (error) {
      console.error('Database Error: ' + error.message);
    }
  };
  const sendMessage = async () => {
    if (newMessage.trim() !== '') {
      console.log('Sending message: ' + newMessage + ' to chatroom of id: ' + chatroom_id);
      socket.emit('message', {
        message: newMessage,
        room: chatroom_id,
      });
      mirroredMessage= await saveMessage(newMessage,1);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, mirroredMessage];
        return updatedMessages;
      });
      console.log(messages)
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
        translateText(data.message, 'es').then( async (translatedText) => {
          console.log('The translation is:', translatedText);
          mirroredMessage= await saveMessage(translatedText,0)
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, mirroredMessage];
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
    const renderChatItem = ({ item }) => {
      const styles = StyleSheet.create({
        messageContainer: {
          flexDirection: 'row',
          marginVertical: 5,
          alignItems: 'center',
        },
        messageBubble: {
          padding: 10,
          borderRadius: 20,
          maxWidth: '80%',
        },
        sentMessage: {
          backgroundColor: 'orange',
          marginLeft: 'auto',
          marginRight: 10,
        },
        receivedMessage: {
          backgroundColor: 'lightgray',
          marginLeft: 10,
        },
        userName: {
          fontSize: 14,
        },
        messageText: {
          fontSize: 14,
          color:'white',
          
        },
      });
      if (item.type === 'dateSeparator') {
        // Render date separator
        return (
          <View style={{ alignItems: 'center', padding: 10 }}>
            <Text style={{ fontSize: 12, color: 'lightgray' }}>{item.date}</Text>
          </View>
        );
      } else {
        // Render message
        const isSentMessage = item.local_sender === 1;
        return (
          <View style={[
            styles.messageContainer,
            isSentMessage ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
          ]}>
            <View style={[
              styles.messageBubble,
              isSentMessage ? styles.sentMessage : styles.receivedMessage
            ]}>
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
          </View>
        );
      }
    }
    
  return (
    <View style={{ flex: 1 }}>
        <View style={{flexDirection: 'row', alignItems: 'center',justifyContent:'space-between',padding:30}}>
        <TouchableOpacity>
        <FontAwesome name="angle-left" size={30} color="#ff9a00" />
        </TouchableOpacity>
        <Text>{route.params.friend.name}</Text>
        <TouchableOpacity>
        <MaterialCommunityIcons name="rotate-3d-variant" size={24} color="#ff9a00" />
        </TouchableOpacity>
        </View>
        <FlatList
  data={prepareMessages(messages)}
  keyExtractor={(item, index) => item.id || index.toString()}
  renderItem={renderChatItem}/>

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