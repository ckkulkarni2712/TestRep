import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export default function Base() {
  const [numspaces, setNumSpaces] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const handleInputChange = (numspaces: string) => {
    setNumSpaces(numspaces);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Parking Management</Text>
      <TextInput
        placeholder="Enter the number of parking spaces"
        style={styles.inputStyle}
        onChangeText={handleInputChange}
        keyboardType="numeric"
      />
      <View style={styles.buttonStyling}>
        <Button
          testID="submit-button"
          disabled={numspaces === ''}
          title="Submit"
          onPress={() => {
            navigation.navigate('Parking Spaces', {numspaces: numspaces});
          }}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputStyle: {
    width: 235,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  buttonStyling: {
    marginTop: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
});
