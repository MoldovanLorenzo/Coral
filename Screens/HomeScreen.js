import React, { useState, useEffect,useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { AppState } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useGlobalBackHandler from '../hooks/useGlobalBackHandler';
import Flag from 'react-native-flags';
import { debounce } from 'lodash';
import { useSocket, SocketProvider } from '../hooks/socketInstance';
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from '@react-navigation/native';
const HomeScreen = ({ isDarkMode, setIsDarkMode, route}) => {
    const navigation = useNavigation();
    const db = SQLite.openDatabase("CoralCache.db");
    const [activeTab, setActiveTab] = useState('friends');
    const [my_language, setUserLanguage] = useState('null');
    let authToken = null;
    const socket=useSocket()
    const [friendsData, setFriendsData] = useState([]);
    const isFocused = useIsFocused();
    const friendsDataRef = useRef([]);
    
    function generateUUID() {
      let d = new Date().getTime();
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    }
    const translateText = async (toTranslate,targetLanguage) => {
      const url = 'https://api-free.deepl.com/v2/translate';
      const authKey = '5528c6fd-705c-5784-afd2-edba369cb1d9:fx'; // Replace with your actual DeepL Auth Key
      const requestBody = {
        text: [toTranslate],
        target_lang: targetLanguage,
      };
    
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `DeepL-Auth-Key ${authKey}`,
            'User-Agent': 'YourApp/1.2.3', // Replace with your app's user agent
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log(data);
        console.log(data)
      } catch (error) {
        console.error('Error during translation:', error);
      }
    };
    const handleAppStateChange = debounce((nextAppState) => {
      if (nextAppState === 'active') {
        console.log('App has come to the foreground!');
        if (!socket.connected) {
          socket.connect();
        }
        navigation.navigate('Home',{fetchFlag:true});
      }
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log('App has gone to the background.');
        if (socket.connected) {
          socket.disconnect();
        }
      }
    },50)
    const fetchData = async () => {
      try {
        const authToken = await AsyncStorage.getItem('auth_token');
        const user_ln=await AsyncStorage.getItem('user_language')
        setUserLanguage(user_ln)
        if (!authToken) {
          navigation.navigate('Login', { message: 'Null token' });
          return;
        }
        const user_id=await AsyncStorage.getItem('user_id')
        const response = await fetch("https://copper-pattern-402806.ew.r.appspot.com/chatrooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authToken,
          },
          body: JSON.stringify({
            "what": "getChatroomsFromUser",
          }),
        });
        console.log(authToken)
        const serverChatrooms = await response.json();
        if ('response' in serverChatrooms && serverChatrooms.response.includes("NOK")) {
          navigation.navigate('Login', { message: 'Expired session, please log in again' });
          return;
        }
        
        
          await db.transaction(tx => {
          serverChatrooms.forEach(serverChatroom => {
            tx.executeSql(
              `INSERT OR REPLACE INTO chatroom (id, name, language, photo) VALUES (?, ?, ?, ?);`,
              [serverChatroom.chatroom_id, serverChatroom.other_user.username, serverChatroom.other_user.preffered_language, serverChatroom.other_user.user_image],
              null,
              error => console.log("Error upserting chatroom" ,error)
            );
          }) 
          tx.executeSql(
            `SELECT id FROM chatroom;`,
            [],
            (_, { rows }) => {
              rows._array.forEach(localChatroom => {
                if (!serverChatrooms.some(serverChatroom => serverChatroom.chatroom_id === localChatroom.id)) {
                  tx.executeSql(
                    `DELETE FROM chatroom WHERE id = ?;`,
                    [localChatroom.id],
                    null,
                    error => console.log("Error deleting chatroom",error)
                  );
                }
              });
            },
            error => console.log("Error selecting chatrooms", error)
          );
        })
        const updateChatrooms = () => {
          return new Promise((resolve, reject) => {
            db.transaction(tx => {
              tx.executeSql(
                `SELECT * FROM chatroom;`,
                [],
                (_, { rows }) => {
                  const updatedChatrooms = rows._array;
                  setFriendsData(updatedChatrooms);
                  friendsDataRef.current = updatedChatrooms;
                  const existingChatroomIds = new Set(friendsData.map(chatroom => chatroom.id));
                  updatedChatrooms.forEach(chatroom => {
                  if (!existingChatroomIds.has(chatroom.id)) {
                    socket.emit('join_room', { "room": chatroom.id });
                  }
                });
                  resolve(updatedChatrooms);
                },
                (tx, error) => {
                  console.log("Error selecting updated chatrooms", error);
                  reject(error);
                }
              );
            });
          });
        };
        updateChatrooms().then(()=>{socket.emit('fetch_pending_messages', {'sender_id': user_id});})
      } catch (error) {
        console.error("Eroare de rețea:", error);
        navigation.navigate('Login', { message: 'Network error' });
      }
    };
    const getFlagCode = (language) => {
      const languageToCodeMapping = {
        "Spanish": 'ES',
        "English":'GB',
        "French":'FR' 
      };
      console.log(language)
      return languageToCodeMapping[language] || 'EU'; 
    };
    const handleReceivedMessages = async (receivedMessages) => {
      console.log('at this timestep, friends data is:')
      console.log(friendsDataRef.current)
      const updatedFriendsData = [...friendsDataRef.current];
      console.log(updatedFriendsData)
      console.log(receivedMessages)

      for (const message of receivedMessages) {
        const chatroomIndex = updatedFriendsData.findIndex(room => room.id == message.room);
        if (chatroomIndex !== -1) {
          updatedFriendsData[chatroomIndex].latest = message;
          
        }
      }
      console.log('friends data')
      setFriendsData(updatedFriendsData);
      console.log(friendsData)
      console.log('just set friendsdata')
    };
    useEffect(() => {
      

      socket.on('pending_messages', async (data) => {
        console.log('received pending messages');
        new_data=data
        new_data.forEach(async(message)=>{
           console.log(my_language)
           translateText(message.message,getFlagCode(my_language)).then((translation)=>{
             message.message=translation.translations[0].text;
           })
        })
        await handleReceivedMessages(new_data);
        try {
          await db.transaction((tx) => {
            new_data.forEach(async(message) => {
              await new Promise((resolve, reject) => {
                tx.executeSql(
                  "INSERT INTO message (id, content, local_sender, chatroom_id, timestamp) VALUES (?, ?, ?, ?, ?);",
                  [generateUUID(), message.message, false, message.room, message.timestamp],
                  () => {
                    console.log("Message saved");
                    console.log(message)
                    resolve();
                  },
                  (t, error) => {
                    console.error("Error saving message", error);
                    reject(error);
                  }
                );
              });
            });
          });
        } catch (error) {
          console.error("Database transaction error:", error);
        }
      });
      socket.on('no_pending_messages',()=>{
        console.log('no pending messages for user');
      }) 
      
      AppState.addEventListener('change', handleAppStateChange);
      return () => {
        socket.off('pending_messages');
        socket.off('no_pending_messages');
        
      };
    }, []);
    useEffect(() => {
      if (isFocused) {
        const fetchFlag = route.params?.fetchFlag ?? false;
        if (fetchFlag) {
            fetchData();
        } else {
        }
    }
   }, [isFocused, route.params]);
    const handleFriendSelection = (friend) => {
      navigation.navigate('FriendChat', {friend,authToken,isDarkMode});
    };

    const handleSettingsSelection = () => {
      navigation.navigate('Settings');
    };

    const handleFriendsFinderSelection = () => {
      navigation.navigate('FriendsFinder',{isDarkMode});
    };

  return (
      <View style={{ flex: 1, backgroundColor: isDarkMode ? '#191919' : 'white' }}>
        <View style={{ flexDirection: 'row',alignItems:'center',justifyContent:'space-between',paddingTop:25,paddingBottom:25}}>
          <TouchableOpacity onPress={handleFriendsFinderSelection} style={{paddingLeft:15}}>
            <FontAwesome name="user-plus" size={25} color="#ff9a00" />
          </TouchableOpacity>
          <Image source={require('../assets/Coral.png')} resizeMode="contain" style={{width:135,height:75}}/>
          <TouchableOpacity style={{paddingRight:15}}
            onPress={handleSettingsSelection}>
            <FontAwesome name="gear" size={30} color="#ff9a00" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', width: 250, alignSelf: 'center', borderRadius: 23, backgroundColor: 'lightgray' }}>
        </View>
        <View style={{ flexDirection: 'row', width: 250, alignSelf: 'center', borderRadius: 23,backgroundColor:'lightgray' }}>
          <TouchableOpacity
            onPress={() => setActiveTab('friends')}
            style={{
              flex: 1,
              backgroundColor: activeTab === 'friends' ? '#ff9a00' : 'lightgray',
              borderRadius: 20,
            }}
          >
            <Text style={{ padding: 16, textAlign: 'center', fontWeight: activeTab === 'friends' ? 'bold' : 'normal' }}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              flex: 1,
              backgroundColor: activeTab === 'chatRooms' ? '#ff9a00' : 'lightgray',
              borderRadius: 20,
            }}>
            <Text style={{ padding: 16, textAlign: 'center',color:'#808080',fontWeight: activeTab === 'chatRooms' ? 'bold' : 'normal' }}>Chat Rooms</Text>
            <Image
            source={require('../assets/coming_soon.png')}
            style={
              {
                width:55,
                height:55,
                position:'absolute',
                top:-17,
                right:-17
              }
            }/>
          </TouchableOpacity>
        </View>
        {activeTab === 'friends' && (
          <FlatList
            data={friendsData}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleFriendSelection(item)}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                
                  marginHorizontal: 10,
                  marginTop: 15,
                  borderRadius: 12,
                  backgroundColor: isDarkMode ? '#191919' : 'lightgray',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderColor:isDarkMode ? 'gray' : 'lightgray',
                  borderWidth: 2,
                }}>
                  <View>
                  <Image
                       source={item.photo ? { uri: "data:image/jpeg;base64,"+item.photo } : require('../assets/default_user.png')}style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        marginRight: 10,
                      }}/>
                  <Flag code={getFlagCode(item.language)} size={16} style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 5,}}/>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 5,color: isDarkMode ? 'gray' : 'black' }}>{item.name}</Text>
                    <Text style={{ fontWeight: item.latest? 'bold' : 'normal', color: isDarkMode ? 'gray' : 'black' }}>
                    {item.latest?.message || 'No new messages'}
                   </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        )}

        {activeTab === 'chatRooms' && (
          <FlatList>
          <View style={{alignSelf: 'center'}}><Text style={{alignSelf:'center'}}>Coming Soon...</Text></View>
          </FlatList>
        )}
         
      </View>
  );
  };

  export default HomeScreen;
