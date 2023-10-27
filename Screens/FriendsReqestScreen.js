import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage"; 
export default function FrinendsRequestScreen({ isDarkMode, setIsDarkMode }) 
{
    const navigation = useNavigation();
    const handleFriendsFinderSelection=()=>{
        navigation.navigate('FriendsFinder')
    }
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        const checkAuthToken = async () => {
            try {
                const authToken = await AsyncStorage.getItem('auth_token');
                if (!authToken) {
                    navigation.navigate('Login', { message: 'Null token' });
                    return null;
                }
                return authToken;
            } catch (error) {
                navigation.navigate('Login', { message: 'Unknown error when retrieving from AsyncStorage' });
                return null;
            }
        };

        const fetchPendingRequests = async (token) => {
            try {
                const response = await fetch("https://copper-pattern-402806.ew.r.appspot.com/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token,
                    },
                    body: JSON.stringify({
                        "what": "getPendingRequests",
                    }),
                });
                return await response.json();
            } catch (err) {
                console.error('Error fetching pending requests:', err);
                return [];
            }
        };

        const fetchUserById = async (token, userId) => {
            try {
                const response = await fetch("https://copper-pattern-402806.ew.r.appspot.com/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token,
                    },
                    body: JSON.stringify({
                        "what": "findUserById",
                        "user_id": userId,
                    }),
                });
                return await response.json();
            } catch (err) {
                console.error(`Error fetching user with ID ${userId}:`, err);
                return null;
            }
        };

        const handlePendingRequests = async () => {
            const token = await checkAuthToken();
            if (!token) return;

            const requests = await fetchPendingRequests(token);
            const requestsWithDetails = [];

            for (let request of requests) {
                const userDetail = await fetchUserById(token, request.sender_id);
                if (userDetail && userDetail.name) {
                    requestsWithDetails.push({
                        requestId: request.id,
                        timestamp: request.timestamp,
                        senderName: userDetail.name,
                    });
                }
            }

            setPendingRequests(requestsWithDetails);
        };

        handlePendingRequests();
    }, [navigation]);
    return(
        <View style={{flex:1,backgroundColor: 'white'}}>
        <View style={{flexDirection: 'row',padding:30,justifyContent:'space-between'}}>
        <TouchableOpacity onPress={handleFriendsFinderSelection}>
        <FontAwesome name="angle-left" size={30} color="#ff9a00" />
        </TouchableOpacity>
        <Text style={{alignSelf:'center', color: isDarkMode ? 'white' : 'black',fontSize:20,fontWeight:'bold'}}>Friends Requests</Text>
        <TouchableOpacity><Text style={{color: isDarkMode ? 'black' : 'white'}}>.</Text></TouchableOpacity>
        </View>
        </View>
    )
}