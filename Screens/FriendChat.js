import React, { useState, useEffect,useRef } from 'react';
import { View, Image, FlatList, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { FIREBASE_FIRESTORE } from "../config/firebase"
import { collection, addDoc, where, query , orderBy, getDocs, onSnapshot } from "firebase/firestore"
import { TranslationProvider, useTranslations } from '../hooks/translationContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Flag from 'react-native-flags';
const FriendChat = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [my_language,setMyLanguage]=useState('null');
  const [newMessage, setNewMessage] = useState('');
  const image=route.params.friend.photo;
  const flatList = useRef(null);
  const cached_ui=useTranslations();
  const [currentUserID, setCurrentUserID]=useState(null);
  const friend_language=route.params.friend.language;
  const chatroom_id = route.params.friend.chatroom_id;
  const navigator=useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);

  const prepareMessages = (messages) => {
    const sortedMessages = messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const preparedMessages = [];
    let lastDate = null;
    sortedMessages.forEach((message) => {
      const messageDate = new Date(message.timestamp).toLocaleDateString();
      if (messageDate !== lastDate) {
        preparedMessages.push({ type: 'dateSeparator', date: messageDate });
        lastDate = messageDate;
      }
      preparedMessages.push(message);
    });
    return preparedMessages;
  };
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        throw new Error('Permission to access camera roll is required!');
      }
  
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, 
        aspect: [4, 3],
        quality: 0.5, 
        base64: true, 
      });
  
      if (!pickerResult.cancelled) {
        setSelectedImage(pickerResult.base64);
      }
    } catch (error) {
      alert('Error picking image:', error);
    }
  };
  const loadMessages = async () => {
    if(my_language=='null'){
      let language=await AsyncStorage.getItem('user_language')
      console.log(language)
      setMyLanguage(language)
    }if(currentUserID==null){
      dcurrentUserID = await AsyncStorage.getItem('user_id');
      setCurrentUserID(dcurrentUserID);
    }
    try {
      const messagesRef = collection(FIREBASE_FIRESTORE, 'messages');
      const messagesQuery = query(
        messagesRef,
        where('chatroom_id', '==', chatroom_id),
        orderBy('timestamp', 'asc')
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      console.log('Loading snapshots!');
      const fetchedMessages = [];
      messagesSnapshot.forEach((messageDoc) => {
        const messageData = messageDoc.data();
        console.log(messageData)
        fetchedMessages.push({
          id: messageDoc.id,
          content: messageData.content,
          sender_id: messageData.sender_id,
          photo_content: messageData.photo_content,
          timestamp: messageData.timestamp,
          translated_content:messageData.translated_content
        });
      });
  
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };
  const sendMessage = async () => {
    if (newMessage.trim() !== '' || selectedImage) {
      try {
        if(currentUserID==null){
          dcurrentUserID = await AsyncStorage.getItem('user_id');
          setCurrentUserID(dcurrentUserID);
        }
        console.log('Sending message: ' + newMessage + ' to chatroom of id: ' + chatroom_id);
        translated_message=await translateText(newMessage,friend_language)
        const messagesCollection = collection(FIREBASE_FIRESTORE, 'messages');
        console.log(translated_message);
        const newDoc={
          sender_id: currentUserID,
          content: newMessage,
          translated_content:translated_message.translations[0].text,
          photo_content: selectedImage,
          chatroom_id: chatroom_id,
          timestamp:new Date().toISOString(),
          sender_language:my_language,
          
        }
        await addDoc(messagesCollection,newDoc);
        const updatedMessages = [
          ...messages,
          newDoc
        ];
  
        setMessages(updatedMessages);
        setNewMessage(' ');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  const translateText = async (toTranslate, targetLanguage) => {
    const url = 'https://api-free.deepl.com/v2/translate';
    const authKey = '5528c6fd-705c-5784-afd2-edba369cb1d9:fx'; 
    const countryCodeMapping = {
      BG: 'BG',
      CN: 'ZH',
      CZ: 'CS',
      DK: 'DA',
      EE: 'ET',
      GR: 'EL',
      HU: 'HU',
      ID: 'ID',
      JP: 'JA',
      KR: 'KO',
      LT: 'LT',
      NO: 'NB',
      RO: 'RO',
      RU: 'RU',
      SI: 'SL',
      TR: 'TR',
      UA: 'UK',
    };
    if (countryCodeMapping.hasOwnProperty(targetLanguage)) {
      targetLanguage = countryCodeMapping[targetLanguage]; 
    }
    console.log(targetLanguage);
    const requestBody = {
      text: [toTranslate],
      target_lang: targetLanguage,
    };
    console.log(requestBody);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${authKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error during translation:', error);
      throw error; 
    }
  };
  
  
    useEffect(()=>{
      if (flatList.current && messages.length > 0) {
        flatList.current.scrollToEnd({ animated: false });
      }
    },[messages])
    useEffect(() => {
      loadMessages();
      const messagesCollection = collection(FIREBASE_FIRESTORE, 'messages');
      const messagesQuery = query(messagesCollection, where('chatroom_id', '==', chatroom_id));
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = [];
      snapshot.forEach((doc) => {
        newMessages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(newMessages);
    });
    return () => unsubscribe();
    },[chatroom_id]);
    
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
          color: 'white',
        },
        imageMessage: {
          width: 150,
          height: 150,
          borderRadius: 10,
        },
        messageContainerWithPhoto: {
          flexDirection: 'column',
          alignItems: 'flex-start', 
          marginBottom: 5, 
        }
      });
    
      if (item.type === 'dateSeparator') {
        return (
          <View style={{ alignItems: 'center', padding: 10 }}>
            <Text style={{ fontSize: 12, color: 'lightgray' }}>{item.date}</Text>
          </View>
        );
      } else if (item.photo_content !== null && item.photo_content !== false) {
        const isSentMessage = item.sender_id === currentUserID;
    
        return (
          <View style={{ flexDirection: 'column' }}>
            <View style={[
              styles.messageContainer,
              isSentMessage ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
            ]}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${item.photo_content}` }}
                style={[
                  styles.imageMessage,
                  isSentMessage ? styles.sentMessage : styles.receivedMessage
                ]}
              />
            </View>
            {item.content.trim() !== '' && (
              <View style={[
                styles.messageContainer,
                isSentMessage ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start'},
              ]}>
                <View style={[
                  styles.messageBubble,
                  isSentMessage ? styles.sentMessage : styles.receivedMessage
                ]}>
                  <Text style={styles.messageText}>{item.content}</Text>
                </View>
              </View>
            )}
          </View>
        );
      } else {
        const isSentMessage = item.sender_id === currentUserID;
    
        return (
          <View style={[
            styles.messageContainer,
            isSentMessage ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
          ]}>
            <View style={[
              styles.messageBubble,
              isSentMessage ? styles.sentMessage : styles.receivedMessage
            ]}>
              <Text style={styles.messageText}>{isSentMessage ? item.content : item.translated_content}</Text>
            </View>
          </View>
        );
      }
    };
    
    
  return (
    <TranslationProvider>
    <View style={{ flex: 1}}>
        <View style={{flexDirection: 'row', alignItems: 'center',justifyContent:'space-between',padding:30}}>
        <TouchableOpacity onPress={()=>{
          navigator.navigate('Home')
        }}>
        <FontAwesome name="angle-left" size={30} color="#ff9a00" />
        </TouchableOpacity>
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <Text style={{ position:'relative',zIndex:2,fontWeight:500,marginRight:10}}>{route.params.friend.name}</Text>
        <Image
          source={image ? { uri: "data:image/jpeg;base64,"+image } : require('../assets/default_user.png')}style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  borderColor:'#ff9a00',
                  borderWidth:2,
                  zIndex:1
                  }}/>
        </View>
        <TouchableOpacity>
        <View style={{flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
        <Flag code={friend_language} size={16} style={{marginBottom:-7,marginRight:15,height:20,width:20}}/>
        <MaterialCommunityIcons name="rotate-3d-variant" size={24} color="#ff9a00" />
        <Flag code={my_language} size={16} style={{marginTop:-7,marginLeft:15,height:20,width:20}}/>  
        </View>  
        </TouchableOpacity>
        </View>
        <FlatList
  data={prepareMessages(messages)}
  ref={flatList}
  keyExtractor={(item, index) => item.id || index.toString()}
  renderItem={renderChatItem}
  onContentSizeChange={() => flatList.current.scrollToEnd({ animated: false })}
/>       
    {selectedImage && (
    <View style={{marginLeft:"5%",marginTop: 10,width:100,height:100}}>
    <Image
      source={{ uri: `data:image/jpeg;base64,${selectedImage}` }}
      style={{
        width: 100,
        height: 100,
        borderRadius: 10,
        opacity: 0.7, // Adjust the opacity as needed
      }}/>
      <TouchableOpacity
      style={{
        position: 'absolute',
        top: -5,
        right: -10,
        zIndex: 2,
        height:'25px',
        width:'25px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
        padding: 5,
      }}
      onPress={() => setSelectedImage(null)}
    >
    <FontAwesome name="ban" size={18} color="white" />  
    </TouchableOpacity>
        </View>
         )}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={{ flex: 1, height: 50, borderColor: 'gray', borderWidth: 1, margin: 5, borderRadius:25,paddingLeft:15 }}
          onChangeText={(text) => setNewMessage(text)}
          value={newMessage}
          placeholder={cached_ui && cached_ui['CHTooltip'] ? cached_ui['CHTooltip'] : 'Input message...'}
          />
          <TouchableOpacity
            style={{ backgroundColor: '#ff9a00', padding: 10, margin: 5, borderRadius: 25}}
            onPress={pickImage}
          >
            <FontAwesome name="image" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: '#ff9a00', padding: 10, margin: 5, borderRadius: 25}}
            onPress={sendMessage}
          >
            <FontAwesome name="paper-plane" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      </TranslationProvider>
  );
};

export default FriendChat;