import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import Flag from 'react-native-flags'; 
import { useNavigation } from '@react-navigation/native';
import { TranslationProvider, useTranslations } from '../hooks/translationContext';
import { FIREBASE_FIRESTORE } from "../config/firebase"
import { collection, query, where, getDocs,getDoc,doc,addDoc,updateDoc } from 'firebase/firestore';
export default function FriendsRequestScreen({ isDarkMode, setIsDarkMode }) {
  const navigation = useNavigation();
  const [pendingRequests, setPendingRequests] = useState([]);
  const usersCollection = collection(FIREBASE_FIRESTORE, 'users');
  const friendshipCollection = collection(FIREBASE_FIRESTORE, 'friendships');
  const chatroomsCollection = collection(FIREBASE_FIRESTORE, 'chatrooms');
  const cached_ui=useTranslations();
useEffect(() => {
  const fetchPendingRequests = async () => {
    try {
      const userID = await AsyncStorage.getItem('user_id');
      const friendshipQuerySnapshot = await getDocs(
        query(friendshipCollection, where('recipient_id', '==', userID),where('status', '==', 'pending'))
      );
      
      const requests = [];
      for (const adoc of friendshipQuerySnapshot.docs) {
        const friendshipData = adoc.data();
        const senderID = friendshipData.sender_id;
        const senderDoc = await getDoc(doc(usersCollection, senderID));
        if (senderDoc.exists()) {
          const senderData = senderDoc.data();
          requests.push({
            id: adoc.id,
            user_image: senderData.photo,
            sender_id:senderID,
            preffered_language: senderData.language,
            username: senderData.displayName,
            timestamp: friendshipData.timestamp
          });
        }
      }
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  fetchPendingRequests();
}, []);


  const renderItem = ({ item }) => {
    return (
      <TranslationProvider>
      <View style={styles.requestItem}>
        {/* Profile Picture and Flag */}
        <View style={styles.profilePictureContainer}>
          <Image
            source={item.user_image ? { uri: "data:image/jpeg;base64,"+item.user_image } : require('../assets/default_user.png')}
            style={styles.avatar}/>
        
          <View style={styles.flagContainer}>
              <Flag code={item.preffered_language} size={16} />
          </View>
        </View>
        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text>{new Date(item.timestamp).toLocaleDateString()}</Text>
        </View>
        {/* Accept Button */}
        <TouchableOpacity style={styles.acceptButton}  onPress={async () => {
       try {
      const recipientID = await AsyncStorage.getItem('user_id');
      const chatRoomRef = await addDoc(chatroomsCollection, {
        name: "undefined(private)", 
        users: [
          doc(usersCollection, item.sender_id),
          doc(usersCollection, recipientID),
        ],
      });
      await updateDoc(doc(friendshipCollection, item.id), {
        status: 'accepted'
      });
      console.log("Chat room created:", chatRoomRef.id);
      navigation.navigate('Home',{fetchFlag:true})
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  }}>
          <FontAwesome name="check" size={20} color="#ff9a00" />
        </TouchableOpacity>
      </View>
      </TranslationProvider>
    );
  };

  return (
    <TranslationProvider>
    <View style={[styles.container, { backgroundColor: isDarkMode ? 'black' : 'white' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('FriendsFinder')}>
          <FontAwesome name="angle-left" size={30} color="#ff9a00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{cached_ui && cached_ui['FRTop'] ? cached_ui['FRTop'] : 'Friend Requests'}</Text>
        <Text style={styles.headerPlaceholder}>.</Text>
      </View>
      {/* List */}
      <FlatList
        data={pendingRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
    </TranslationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    alignSelf: 'center',
    color: '#ff9a00',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerPlaceholder: { 
    opacity: 0,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  profilePictureContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  flagContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  acceptButton: {
    padding: 10,
    borderRadius: 5,
  },
});