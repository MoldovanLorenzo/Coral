import React, { useState } from "react";
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function CountrySelector({ onCountryChange }) {
  const [selectedCountry, setSelectedCountry] = useState("");

  const countries = [
    { label: "Selectează țara", value: "" },
    { label: "România", value: "romania" },
    { label: "Statele Unite", value: "usa" },
    { label: "Canada", value: "canada" },
    { label: "Marea Britanie", value: "marea britanie" },
  ];

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    onCountryChange(value);
  };

  return (
    <View>
      <Text>Selectează țara de proveniență:</Text>
      <RNPickerSelect
        items={countries}
        onValueChange={handleCountryChange}
        value={selectedCountry}
      />
      <Text>Țara selectată: {selectedCountry}</Text>
    </View>
  );
}

