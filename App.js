import React from "react";
import HomeScreen from "./Screens/HomeScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import FriendChat from "./Screens/FriendChat";
import ChatComponent from "./Screens/Chat";
import Settings from "./Screens/Settings";
import Singup from "./Screens/Singup";
import Login from "./Screens/Login";
import GetStartet from"./Screens/GetStardet";
import FriendsFinder from "./Screens/FriendsFinder";
const Stack = createStackNavigator();
const App = () => {
  return (
  <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
        name="GetStartet"
        component={GetStartet}
        options={{headerShown: false}}
        />
        <Stack.Screen
        name="Singup"
        component={Singup}
        options={{headerShown: false}} />
        <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FriendChat"
          component={FriendChat}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatRoom"
          component={ChatComponent}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{headerShown: false}}
        />
        <Stack.Screen
        name="FriendsFinder"
        component={FriendsFinder}
        options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
