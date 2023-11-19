import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import Flag from 'react-native-flags';
const FriendsFinder = ({isDarkMode}) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const handleNavigateHome = () => {
    navigation.navigate('Home');
  };
  const handleFriendsRequestScreen=()=>{
    navigation.navigate('Request');
  }
  const checkAuthToken = async () => {
    try {
      authToken = await AsyncStorage.getItem('auth_token');
      console.log(authToken);
    } catch (error) {
      console.error('Eroare la retragerea token-ului:', error);
    }
  };
  const getFlagCode = (language) => {
    const languageToCodeMapping = {
      Spanish: 'ES',
      English:'GB' 
    };
    return languageToCodeMapping[language] || 'EU'; 
  };
  const handleSearch = async () => {
    try {
      
      checkAuthToken().then(() =>
        fetch("https://copper-pattern-402806.ew.r.appspot.com/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authToken,
          },
          body: JSON.stringify({
            "what": "findUserByString",
            "username": searchText
          }),
        })
          .then((response) => response.json())
          .then(async (responseData) => {
            console.log(responseData)
            setSearchResults(responseData);
          })
          .catch((error) => {
            console.error("Eroare de rețea:", error);
          })
      );

    } catch (error) {
      console.error("Eroare de rețea:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#191919' : 'white' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleNavigateHome}>
          <FontAwesome name="angle-left" size={30} color="#ff9a00" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Add Friends</Text>
        </View>
        <TouchableOpacity onPress={handleFriendsRequestScreen}>
        <FontAwesome name="envelope" size={24} color="#ff9a00" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search Friends"
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
    const flagCode=getFlagCode(item.preffered_language)
    switch (item.status) {
      case "none":
        button = (
          <TouchableOpacity style={{ justifyContent: 'flex-end' }} onPress={() => {checkAuthToken().then(() =>
            fetch("https://copper-pattern-402806.ew.r.appspot.com/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": authToken,
              },
              body: JSON.stringify({
                "what": "sendFriendRequest",
                "recipient_id": item.id
              }),
            })
              .then((response) => response.json())
              .then(async (responseData) => {
                console.log(responseData)
                if (responseData.response=='OK') {
                  const updatedResults = searchResults.map((sr) => {
                    if (sr.id === item.id) {
                      return { ...sr, status: 'sent' }; 
                    }
                    return sr;
                  });
                  setSearchResults(updatedResults);
                }
              })
              .catch((error) => {
                console.error("Eroare de rețea:", error);
              })
          );}}>
            <FontAwesome name="user-plus" size={20} color="#ff9a00" />
          </TouchableOpacity>
        );
        break;
      case "sent":
        button = (
          <TouchableOpacity style={{ justifyContent: 'flex-end' }} onPress={() => {}}>
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
        {item.preffered_language === "English" && (
            <View style={styles.flagContainer}>
              <Flag code={flagCode}  size={16} />
            </View>
          )}</View>
        <View>
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
    backgroundColor: 'black',
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
    fontWeight:'bold',
    color: "white",
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
    justifyContent:'space-between',
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
