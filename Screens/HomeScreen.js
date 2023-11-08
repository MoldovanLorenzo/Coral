import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useGlobalBackHandler from '../hooks/useGlobalBackHandler';
import Flag from 'react-native-flags';
import { useSocket, SocketProvider } from '../hooks/socketInstance';
  const HomeScreen = ({ isDarkMode, setIsDarkMode }) => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('friends');
    let authToken = null;
    const socket=useSocket()
    const [friendsData, setFriendsData] = useState([]);
    const getFlagCode = (language) => {
      const languageToCodeMapping = {
        Spanish: 'ES',
        English:'GB' 
      };
      return languageToCodeMapping[language] || 'EU'; 
    };
    useGlobalBackHandler();
    
    useEffect(() => {
      console.log("ENTERED USE EFFECT OF HOME SCREEN!")
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
            const newData = responseData
            newData.forEach(element => {
              socket.emit('join_room',{"room":element.chatroom_id})
            });
            setFriendsData(newData);
            
          })
          .catch((error) => {
            console.error("Eroare de rețea:", error);
            return;
          })
      );
      
    }, [navigation]);
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
                  <View>
                  <Image
                       source={item.other_user.user_image ? { uri: "data:image/jpeg;base64"+item.other_user.user_image } : require('../assets/default_user.png')}style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        marginRight: 10,
                      }}/>
                  <Flag code={getFlagCode(item.preffered_language)} size={16} style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 5,}}/>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 5,color: isDarkMode ? 'gray' : 'black' }}>{item.other_user.username}</Text>
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
