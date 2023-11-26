import React from 'react';
import { View, StyleSheet, Image,Text } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
     <Image source={require('../assets/globe-spin.gif')} resizeMode="contain" style={styles.gif}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255,255, 1)', 
    zIndex:10
  },
  gif: {
    width: 500, // Adjust as needed
    height: 500, // Adjust as needed
  },
});

export default LoadingScreen;