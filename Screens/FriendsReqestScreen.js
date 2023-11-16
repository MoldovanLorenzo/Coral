import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import Flag from 'react-native-flags'; // Ensure this is the correct import based on your flags library
import { useNavigation } from '@react-navigation/native';
export default function FriendsRequestScreen({ isDarkMode, setIsDarkMode }) {
  const navigation = useNavigation();
  const [pendingRequests, setPendingRequests] = useState([]);
  const getFlagCode = (language) => {
    const languageToCodeMapping = {
      'Spanish': 'ES',
      'English': 'GB',
      'Bulgarian': 'BG',
      'Chinese': 'CN',
      'Czech': 'CZ',
      'Danish': 'DK',
      'Dutch': 'NL',
      'Estonian': 'EE',
      'Finnish': 'FI',
      'French': 'FR',
      'German': 'DE',
      'Greek': 'GR',
      'Hungarian': 'HU',
      'Indonesian': 'ID',
      'Italian': 'IT',
      'Japanese': 'JP',
      'Korean': 'KR',
      'Latvian': 'LV',
      'Lithuanian': 'LT',
      'Norwegian': 'NO',
      'Polish': 'PL',
      'Portuguese': 'PT',
      'Romanian': 'RO',
      'Russian': 'RU',
      'Slovak': 'SK',
      'Slovenian': 'SI',
      'Swedish': 'SE',
      'Turkish': 'TR',
      'Ukrainian': 'UA',
    };
    return languageToCodeMapping[language] || 'EU';
  };
  
  useEffect(() => {
    async function fetchPendingRequests() {
      let authToken;
      try {
        authToken = await AsyncStorage.getItem('auth_token');
        if (authToken == null) {
          navigation.navigate('Login', { message: 'Null token' });
          return;
        }
      } catch (error) {
        navigation.navigate('Login', { message: 'Unknown error when retrieving from AsyncStorage' });
        return;
      }

      fetch("https://copper-pattern-402806.ew.r.appspot.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken,
        },
        body: JSON.stringify({
          "what": "getPendingRequests",
        }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log(responseData)
          setPendingRequests(responseData);
        })
        .catch((error) => {
          console.error("Eroare de rețea:", error);
        });
    }
    
    fetchPendingRequests();
  }, [navigation]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.requestItem}>
        {/* Profile Picture and Flag */}
        <View style={styles.profilePictureContainer}>
          <Image
            source={item.user_image ? { uri: "data:image/jpeg;base64,"+item.user_image } : require('../assets/default_user.png')}
            style={styles.avatar}/>
        
          <View style={styles.flagContainer}>
              <Flag code={getFlagCode(item.preffered_language)} size={16} />
          </View>
        </View>
        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text>{new Date(item.timestamp).toLocaleDateString()}</Text>
        </View>
        {/* Accept Button */}
        <TouchableOpacity style={styles.acceptButton} onPress={async () => {
          
            let authToken;
            try {
              authToken = await AsyncStorage.getItem('auth_token');
              if (authToken == null) {
                navigation.navigate('Login', { message: 'Null token' });
                return;
              }
            } catch (error) {
              navigation.navigate('Login', { message: 'Unknown error when retrieving from AsyncStorage' });
              return;
            }
            fetch("https://copper-pattern-402806.ew.r.appspot.com/users", {
             method: "POST",
             headers: {
             "Content-Type": "application/json",
             "Authorization": authToken,
             },
            body: JSON.stringify({
            "what": "acceptFriendRequest",
            "request_id":item.id
            }),
           })
        .then((response) => response.json())
        .then((responseData) => {
          if(responseData.response=='OK'){
          setPendingRequests((currentRequests) =>
          currentRequests.filter(request => request.id !== item.id)
             );
         }else{
          //WARN THE USER
          console.log(responseData)
         } }).then(()=>{
          navigation.navigate('Home',{fetchFlag:true})
         })
        .catch((error) => {
          console.error("Eroare de rețea:", error);
        });
    }}>
          <FontAwesome name="check" size={20} color="#ff9a00" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? 'black' : 'white' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="angle-left" size={30} color="#ff9a00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friends Requests</Text>
        <Text style={styles.headerPlaceholder}>.</Text>
      </View>
      {/* List */}
      <FlatList
        data={pendingRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
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