import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const FriendsFinder = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const handleNavigateHome = () => {
    navigation.navigate('Home');
  };

  const handleSearch = async () => {
    try {
      const checkAuthToken = async () => {
        try {
          authToken = await AsyncStorage.getItem('authToken');
          console.log(authToken);
        } catch (error) {
          console.error('Eroare la retragerea token-ului:', error);
        }
      };
      checkAuthToken().then(() =>
        fetch("http://simondarius.pythonanywhere.com/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authToken,
          },
          body: JSON.stringify({
            "what": "findUserByString",
            "username":searchText
          }),
        })
          .then((response) => response.json())
          .then(async (responseData) => {
            console.log("Response from server:", responseData);
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleNavigateHome}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Add Friends</Text>
        </View>
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
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.friendName}>{item.username}</Text>
              <Text>{item.id}</Text>
            </View>
          </View>
        )}
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
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ff9a00',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    alignSelf:'center'
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
    padding: 10,
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
