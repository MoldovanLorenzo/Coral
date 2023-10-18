
import React, { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./Screens/HomeScreen";
import FriendChat from "./Screens/FriendChat";
import ChatComponent from "./Screens/Chat";
import Settings from "./Screens/Settings";
import Singup from "./Screens/Singup";
import Login from "./Screens/Login";
import GetStartet from "./Screens/GetStardet";
import FriendsFinder from "./Screens/FriendsFinder";
import Profile from "./Screens/SettingsScreens/Profile";
import Asistence from "./Screens/SettingsScreens/Asistence";
import Feedbad from "./Screens/SettingsScreens/Feedbad";
import Themes from "./Screens/SettingsScreens/Themes";
import Notifications from "./Screens/SettingsScreens/Notifications";
import Language from "./Screens/SettingsScreens/Language";

const Stack = createStackNavigator();

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="GetStartet"
          component={GetStartet}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Singup"
          component={Singup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          children={(props) => (
            <HomeScreen
              {...props}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FriendChat"
          children={(props) => (
            <FriendChat
              {...props}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Asistence"
          children={(props) => (
            <Asistence
              {...props}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Feedback"
          children={(props) => (
            <Feedbad
              {...props}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Language"
          children={(props) => (
            <Language
              {...props}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notifications"
          children={(props) => (
            <Notifications
              {...props}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatRoom"
          children={(props) => (
            <ChatComponent
              {...props}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          children={(props) => (
            <Settings
              {...props}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          children={(props) => (
            <Profile
              {...props}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FriendsFinder"
          children={(props) => (
            <FriendsFinder
              {...props}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Themes"
          children={(props) => (
            <Themes
              {...props}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
