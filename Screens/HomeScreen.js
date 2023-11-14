import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { AppState } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useGlobalBackHandler from '../hooks/useGlobalBackHandler';
import Flag from 'react-native-flags';
import { useSocket, SocketProvider } from '../hooks/socketInstance';
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from '@react-navigation/native';
const HomeScreen = ({ isDarkMode, setIsDarkMode, route}) => {
    const navigation = useNavigation();
    const db = SQLite.openDatabase("CoralCache.db");
    const [activeTab, setActiveTab] = useState('friends');
    let authToken = null;
    const socket=useSocket()
    const [friendsData, setFriendsData] = useState([]);
    const isFocused = useIsFocused();
    const fetchData = async () => {
      try {
        const authToken = await AsyncStorage.getItem('auth_token');
        if (!authToken) {
          navigation.navigate('Login', { message: 'Null token' });
          return;
        }
      
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
        console.log('HERE2')
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
        
        
        await db.transaction(tx=>{
            tx.executeSql(
              `SELECT * FROM chatroom;`,
              [],
              (_, { rows }) => {
                const updatedChatrooms = rows._array;
                setFriendsData(updatedChatrooms);
    
                const existingChatroomIds = new Set(friendsData.map(chatroom => chatroom.id));
                updatedChatrooms.forEach(chatroom => {
                  if (!existingChatroomIds.has(chatroom.id)) {
                    socket.emit('join_room', { "room": chatroom.id });
                  }
                });
              },
              error => console.log("Error selecting updated chatrooms", error)
            );
          })
      } catch (error) {
        console.error("Eroare de rețea:", error);
        navigation.navigate('Login', { message: 'Network error' });
      }
    };
    const getFlagCode = (language) => {
      const languageToCodeMapping = {
        Spanish: 'ES',
        English:'GB' 
      };
      return languageToCodeMapping[language] || 'EU'; 
    };
    useGlobalBackHandler();
    
    useEffect(() => {
      const handleAppStateChange = (nextAppState) => {
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
      };
  
      AppState.addEventListener('change', handleAppStateChange);
      if (isFocused) {
        const fetchFlag = route.params?.fetchFlag ?? false;
        if (fetchFlag) {
            fetchData();
        } else {
            
        }
    }
   }, [isFocused, route.params]);
    const handleFriendSelection = (friend) => {
      navigation.navigate('FriendChat', {friend,authToken});
    };

    const handleSettingsSelection = () => {
      navigation.navigate('Settings');
    };

    const handleFriendsFinderSelection = () => {
      navigation.navigate('FriendsFinder');
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
                    <Text style={{color: isDarkMode ? 'gray' : 'black'}}>Ultimul mesaj trimis</Text>
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
