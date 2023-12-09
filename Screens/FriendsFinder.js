import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TranslationProvider, useTranslations } from '../hooks/translationContext';
import Flag from 'react-native-flags';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_FIRESTORE } from "../config/firebase"
import { collection, query, where,getDocs,addDoc } from 'firebase/firestore';
const FriendsFinder = () => {
  const navigation = useNavigation();
  const usersCollection = collection(FIREBASE_FIRESTORE, 'users');
  const friendshipsCollection = collection(FIREBASE_FIRESTORE, 'friendships');
  const [searchText, setSearchText] = useState('');
  const cached_ui=useTranslations();
  const [searchResults, setSearchResults] = useState([]);
  const handleNavigateHome = () => {
    navigation.navigate('Home');
  };
  const handleFriendsRequestScreen=()=>{
    navigation.navigate('Request');
  }
  const determineStatus = async (searchResults) => {
    const currentUserID = await AsyncStorage.getItem('user_id');
    const filteredResults = searchResults.filter((result) => result.id !== currentUserID);
  
    for (const result of filteredResults) {
      const { id: userID } = result;
  
      const senderRecipientQuery = query(friendshipsCollection, where('sender_id', '==', currentUserID), where('recipient_id', '==', userID));
      const recipientSenderQuery = query(friendshipsCollection, where('sender_id', '==', userID), where('recipient_id', '==', currentUserID));
  
      const senderRecipientDocs = await getDocs(senderRecipientQuery);
      const recipientSenderDocs = await getDocs(recipientSenderQuery);
  
      let status = 'none';
  
      senderRecipientDocs.forEach((doc) => {
        if (doc.data().status === 'pending') {
          status = 'incoming';
        } else if (doc.data().status === 'accepted') {
          status = 'friends';
        }
      });
  
      recipientSenderDocs.forEach((doc) => {
        if (doc.data().status === 'pending') {
          status = 'sent';
        } else if (doc.data().status === 'accepted') {
          status = 'friends';
        }
      });
  
      result.status = status;
    }
  
    setSearchResults(filteredResults);
  };
  
  
  const handleSearch = async () => {
    const querySnapshot = await getDocs(usersCollection);
    const results = [];

querySnapshot.forEach((doc) => {
  const displayName = doc.data().displayName;
  if (displayName.toLowerCase().includes(searchText.toLowerCase())) {
    results.push({
      user_image: doc.data().photo,
      id: doc.id,
      preffered_language: doc.data().language,
      username: displayName,
      status: 'none',
    });
  }
});
  determineStatus(results);
  };

  return (
    <TranslationProvider>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleNavigateHome}>
          <FontAwesome name="angle-left" size={30} color="#ff9a00" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>{cached_ui && cached_ui['FFTop'] ? cached_ui['FFTop'] : 'Add Friends'}</Text>
        </View>
        <TouchableOpacity onPress={handleFriendsRequestScreen}>
        <FontAwesome name="envelope" size={24} color="#ff9a00" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={cached_ui && cached_ui['FFTooltip'] ? cached_ui['FFTooltip'] : 'Search Friends'}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity onPress={handleSearch}>
          <FontAwesome name="search" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
  data={searchResults}
  renderItem={({ item }) => {
    const imageSource = item.user_image
      ? { uri: `data:image/jpeg;base64,${item.user_image}` }
      : require('../assets/default_user.png');

    let button;
    switch (item.status) {
      case "none":
        button = (
          <TouchableOpacity style={{ justifyContent: 'flex-end' }} onPress={async () => {
            try {
              const currentUserID = await AsyncStorage.getItem('user_id');
              const timestamp = new Date();
              await addDoc(friendshipsCollection, {
                sender_id: currentUserID,
                recipient_id: item.id,
                timestamp: timestamp.toISOString(),
                status:'pending', 
              });
        
              const updatedResults = searchResults.map((sr) => {
                if (sr.id === item.id) {
                  return { ...sr, status: 'sent' };
                }
                return sr;
              });
              setSearchResults(updatedResults);
        
              console.log('Friendship document created successfully!');
            } catch (error) {
              console.error('Error creating friendship document:', error);
            }
          }}>
            <FontAwesome name="user-plus" size={20} color="#ff9a00" />
          </TouchableOpacity>
        );
        break;
      case "sent":
        button = (
          <TouchableOpacity style={{ justifyContent: 'flex-end' }} >
            <FontAwesome name="ellipsis-h" size={20} color='lightgray' />
          </TouchableOpacity>
        );
        break;
      case "incoming":
        button = (
          <TouchableOpacity style={{ justifyContent: 'flex-end' }} onPress={handleFriendsRequestScreen}>
            <FontAwesome name="envelope" size={20} color="#ff9a00" />
          </TouchableOpacity>
        );
        break;
      case "friends":
        button = (
          <TouchableOpacity style={{ justifyContent: 'flex-end' }} onPress={()=>{
            navigation.navigate('Home')
          }}>
            <FontAwesome name="group" size={20} color="lightgray" />
          </TouchableOpacity>
        );
      break;
      default:
        button = null; 
    }

    return (
      <View style={styles.friendItem}>
        <View>
        <Image source={imageSource} style={styles.avatar} />
        <View style={styles.flagContainer}>
          <Flag code={item.preffered_language}  size={16} />
        </View>
        </View>
        <View style={{paddingLeft:"10%",paddingRight:"10%"}}>
          <Text style={styles.friendName}>{item.username}</Text>
          <Text style={{ color: 'lightgray', fontSize: 10 }}>{item.id}</Text>
        </View>
        {button}
      </View>
    );
  }}
  keyExtractor={(item) => item.id.toString()}
/>
    </View>
    </TranslationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  flagContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    alignSelf: 'center',
    fontWeight:'bold'
  },
  inputContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    borderColor: 'gray',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    color: 'black',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'start',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendName: {
    fontWeight: 'bold',
  },
});

export default FriendsFinder;
