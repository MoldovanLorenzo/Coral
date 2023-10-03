import React, { useState } from "react";
import { View, Text, TextInput } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function Signup() {
  return (
    <View style={{ flex: 1, backgroundColor: '#ff9a00' }}>
      <View style={{
        backgroundColor: "white",
        height: 500,
        width: 320,
        alignSelf: 'center',
        marginTop: 130,
        borderRadius: 30,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}>
        <Text style={{
          alignSelf: 'center',
          fontSize: 40,
          fontWeight: 'bold',
          marginTop: 30,
        }}>
          Sign up
        </Text>
        <TextInput placeholder="Username" style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray', margin: 20 }} />
        <TextInput placeholder="Password" style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray', margin: 20 }} />
      </View>
    </View>
  );
}

