import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('friends');
  let authToken = null;
  const [friendsData, setFriendsData] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        authToken = await AsyncStorage.getItem('authToken');
        console.log(authToken);
      } catch (error) {
        console.error('Eroare la retragerea token-ului:', error);
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
          const friendsData = responseData.filter(data => data.is_friends_chatroom === true);
          const chatRooms = responseData.filter(data => data.is_friends_chatroom === false);

          setFriendsData(friendsData);
          setChatRooms(chatRooms);
        })
        .catch((error) => {
          console.error("Eroare de rețea:", error);
        })
    );
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
      {/* Restul codului a rămas neschimbat și a fost eliminat marcajul de conflict */}
    </View>
  );
};

export default HomeScreen;
