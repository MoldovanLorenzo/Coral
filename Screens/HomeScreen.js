import React, { useState, useEffect,useRef } from 'react';
import { TranslationProvider, useTranslations } from '../hooks/translationContext';
import { View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { FIREBASE_FIRESTORE } from "../config/firebase"
import { query, where, getDocs,getDoc,doc,collectionGroup } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useGlobalBackHandler from '../hooks/useGlobalBackHandler';
import LoadingScreen from './LoadingScreen'
import Flag from 'react-native-flags';


import { useIsFocused } from '@react-navigation/native';
const HomeScreen = ({ isDarkMode, setIsDarkMode, route}) => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('friends');
    const [friendsData, setFriendsData] = useState([]);
    const isFocused = useIsFocused();
    const {cached_ui, updateTranslations}=useTranslations();
    useGlobalBackHandler();  
    const fetchData = async () => {
      setLoading(true);
      console.log(cached_ui);
      try {
        const currentUserID = await AsyncStorage.getItem('user_id');
        console.log('Current UserID:', currentUserID);
    
        const userDocRef = doc(FIREBASE_FIRESTORE, 'users', currentUserID);
    
        const chatroomRef = collectionGroup(FIREBASE_FIRESTORE, 'chatrooms');
        const chatroomQuery = query(chatroomRef, where('users', 'array-contains', userDocRef));
        const chatroomSnapshot = await getDocs(chatroomQuery);
    
        console.log('Chatrooms found:', chatroomSnapshot.size);
    
        const usersData = [];
    
        for (const chatroomDoc of chatroomSnapshot.docs) {
          const chatroomData = chatroomDoc.data();
          console.log(chatroomData);
    
          for (const userRef of chatroomData.users) {
            const userID = userRef.id; 
    
            if (userID !== currentUserID) {
              const userDocRef = doc(FIREBASE_FIRESTORE, 'users', userID);
              const userDocSnapshot = await getDoc(userDocRef);
    
              if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
    
                usersData.push({
                  chatroom_id:chatroomDoc.id,
                  id: userDocSnapshot.id,
                  name: userData.displayName,
                  language: userData.language,
                  photo: userData.photo,
                });
              } else {
                console.log(`User with ID ${userID} does not exist`);
              }
            }
          }
        }
    
        console.log('Users Data:', usersData);
        setFriendsData(usersData);
      } catch (error) {
        console.error('Error fetching friends data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    useEffect(() => {
      if (isFocused) {
        const fetchFlag = route.params?.fetchFlag ?? false;
        if (fetchFlag) {
          console.log('fetching....')
            fetchData();
        } else {
        }
    }
   }, [isFocused, route.params]);
    const handleFriendSelection = (friend) => {
      console.log(friend);
      navigation.navigate('FriendChat', {friend});
    };

    const handleSettingsSelection = () => {
      navigation.navigate('Settings');
    };

    const handleFriendsFinderSelection = () => {
      navigation.navigate('FriendsFinder');
    };

  return (
      <TranslationProvider>
      <View style={{ flex: 1, backgroundColor: isDarkMode ? '#191919' : 'white' }}>
        {loading && <LoadingScreen />}
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
            <Text style={{ padding: 16, textAlign: 'center', fontWeight: activeTab === 'friends' ? 'bold' : 'normal' }}>{cached_ui && cached_ui['HSFriends'] ? cached_ui['HSFriends'] : 'Friends'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              flex: 1,
              backgroundColor: activeTab === 'chatRooms' ? '#ff9a00' : 'lightgray',
              borderRadius: 20,
            }}>
            <Text style={{ padding: 16, textAlign: 'center',color:'#808080',fontWeight: activeTab === 'chatRooms' ? 'bold' : 'normal' }}>{cached_ui && cached_ui['HSChatroom'] ? cached_ui['HSChatroom'] : 'Chat rooms'}</Text>
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
                  <Flag code={item.language} size={16} style={{
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
      </TranslationProvider>
  );
  };

  export default HomeScreen;
