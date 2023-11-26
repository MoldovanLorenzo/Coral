import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigationState, useNavigation } from '@react-navigation/native';
const useGlobalBackHandler = () => {
    const navigation = useNavigation();
    const currentRouteName = useNavigationState(
        (state) => state.routes[state.index].name
      );
    
      const isBlockedScreen =
        currentRouteName === 'Home' ||
        currentRouteName === 'Login' ||
        currentRouteName === 'Signup' ||
        currentRouteName === 'GetStarted';
    
      const onBackPress = () => {
        if (isBlockedScreen) {
          return true; 
        } else {
          return false; 
        }
      };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        };
    }, [currentRouteName]); 
};

export default useGlobalBackHandler;