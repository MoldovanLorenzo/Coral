import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useGlobalBackHandler from '../hooks/useGlobalBackHandler';
import io from 'socket.io-client';
  import { useSocket, SocketProvider } from '../hooks/socketInstance';
  const HomeScreen = ({ isDarkMode, setIsDarkMode }) => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('friends');
    let authToken = null;
    const [socket, setSocket] = useState(null);
    const [friendsData, setFriendsData] = useState([]);
    const [chatRooms, setChatRooms] = useState([]);
    useGlobalBackHandler();
    useEffect(() => {
      const checkAuthToken = async () => {
        try {
          authToken = await AsyncStorage.getItem('auth_token');
          console.log(authToken);
          const newSocket = io("http://192.168.100.132:10000", {
          transports: ['websocket'],
          jsonp: false 
          });

        newSocket.on('connection_ACK', () => {
          console.log('ACK received from socket');
        });
        newSocket.on('message',()=>{
          console.log('message recieved');
        })

          newSocket.connect();
          setSocket(newSocket);
          console.log('connected to socket')
          if(authToken==null){
            navigation.navigate('Login', { message: 'Null token' });
            return;
          }
        } catch (error) {
          navigation.navigate('Login', { message: 'Unknown error when retrieving from AsyncStorage' });
          return;
        }
      };
      
      checkAuthToken().then(() =>
        fetch("https://copper-pattern-402806.ew.r.appspot.com/chatrooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authToken,
          },
          body: JSON.stringify({
            "what": "getChatroomsFromUser",
          }),
        })
          .then((response) => response.json())
          .then(async (responseData) => {
            console.log("Response from server:", responseData);
            try{
              if(responseData.response.includes("NOK")){
                navigation.navigate('Login', { message: 'Expired session, please log in again' });
                return;
              }

            }catch{
            }
            const friendsData = responseData.filter(data => data.is_friends_chatroom === true);
            const chatRooms = responseData.filter(data => data.is_friends_chatroom === false);
            console.log(friendsData)
            setFriendsData(friendsData);
            setChatRooms(chatRooms);
          })
          .catch((error) => {
            console.error("Eroare de rețea:", error);
            return;
          })
      );
      
    }, [navigation]);
    useEffect(() => {
      if (socket && friendsData.length > 0) {
          friendsData.forEach(element => {
              socket.emit('join_room', element.id);
              console.log('Emitted join for id:');
              console.log(element.id);
          });
      }
  }, [socket, friendsData]);
    const handleFriendSelection = (friend) => {
      navigation.navigate('FriendChat', {friend});
    };

    const handleChatRoomSelection = (chatRoom) => {
      navigation.navigate('ChatRoom', { chatRoom });
    };

    const handleSettingsSelection = () => {
      navigation.navigate('Settings');
    };

    const handleFriendsFinderSelection = () => {
      navigation.navigate('FriendsFinder');
    };

  return (
    <SocketProvider value={socket}>
      <View style={{ flex: 1, backgroundColor: isDarkMode ? '#191919' : 'white' }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={handleFriendsFinderSelection} style={{ alignSelf: 'center', position: 'relative', left: 20 }}>
            <FontAwesome name="user-plus" size={25} color="#ff9a00" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSettingsSelection}
            style={{ position: 'relative', left: 250, top: 57, margin: 0 }}
          >
            <FontAwesome name="gear" size={30} color="#ff9a00" />
          </TouchableOpacity>

          <Text style={{ alignSelf: 'center', margin: 50, marginLeft: 65, fontSize: 30, fontWeight: 'bold',color: isDarkMode ? 'gray' : 'black' }}>Chats</Text>
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
            onPress={() => setActiveTab('chatRooms')}
            style={{
              flex: 1,
              backgroundColor: activeTab === 'chatRooms' ? '#ff9a00' : 'lightgray',
              borderRadius: 20,
            }}
          >
            <Text style={{ padding: 16, textAlign: 'center', fontWeight: activeTab === 'chatRooms' ? 'bold' : 'normal' }}>Chat Rooms</Text>
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
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: 'white',
                    marginRight: 10,
                  }}>
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
    </SocketProvider>
  );
  };

  export default HomeScreen;
