import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useGlobalBackHandler from '../hooks/useGlobalBackHandler';
import io from 'socket.io-client';
const HomeScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('friends');
  let authToken = null;
  const [friendsData, setFriendsData] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const socket=io("http://simondarius.pythonanywhere.com");
  useGlobalBackHandler();
  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        authToken = await AsyncStorage.getItem('auth_token');
        console.log(authToken);
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
      fetch("http://simondarius.pythonanywhere.com/chatrooms", {
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

          setFriendsData(friendsData);
          setChatRooms(chatRooms);
        })
        .catch((error) => {
          console.error("Eroare de rețea:", error);
          return;
        })
    );
    socket.emit('connection_token', JSON.stringify({socket_message:authToken}));
    socket.on('connect_clear', (message) => {
      console.log('Succesfully connected to Socket.IO server');
      console.log(message);
    })
    socket.on('connect_fail', (message) => {
      console.log('Failed connecting to Socket.IO server');
      console.log(message);
    })
    socket.on('message', (message) => {
      console.log('Message received:', message);
    });

  }, [navigation]);

  const handleFriendSelection = (friend) => {
    navigation.navigate('FriendChat', { friend });
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
      <View style={{ flex: 1 }}>
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

        <Text style={{ alignSelf: 'center', margin: 50, marginLeft: 65, fontSize: 30, fontWeight: 'bold' }}>Chats</Text>
      </View>

      <View style={{ flexDirection: 'row', width: 250, alignSelf: 'center', borderRadius: 23, backgroundColor: 'lightgray' }}>
      </View>
      <View style={{ flexDirection: 'row', width: 250, alignSelf: 'center', borderRadius: 23,backgroundColor:'lightgray' }}>
        <TouchableOpacity
          onPress={() => setActiveTab('friends')}
          style={{
            flex: 1,
            backgroundColor: activeTab === 'friends' ? '#ff9a00' : 'lightgray',
            borderRadius: 30,
          }}
        >
          <Text style={{ padding: 16, textAlign: 'center', fontWeight: activeTab === 'friends' ? 'bold' : 'normal' }}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('chatRooms')}
          style={{
            flex: 1,
            backgroundColor: activeTab === 'chatRooms' ? '#ff9a00' : 'lightgray',
            borderRadius: 30,
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
                backgroundColor: 'lightgray',
                marginHorizontal: 10,
                marginTop: 15,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 10,
              }}>
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: 'gray',
                  marginRight: 10,
                }}>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{item.name}</Text>
                  <Text>Ultimul mesaj trimis</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      {activeTab === 'chatRooms' && (
        <FlatList
          data={chatRooms}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleChatRoomSelection(item)} style={{ alignItems: 'center' }}>
              <View style={{ flexDirection: 'column', padding: 16, alignItems: 'center', width: 300, backgroundColor: 'lightgray', marginHorizontal: 10, marginTop: 15, borderRadius: 12, height: 65 }}>
                <Text>{item.name}</Text>
                <Text style={{ fontWeight: 'bold' }}>Members: </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};
export default HomeScreen;
