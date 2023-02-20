import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export default function PaymentScreen({route}: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {spaces, space, details} = route.params;
  const [parkingCharge, setCharges] = useState<number>();
  const [timeSpent, setTimeSpent] = useState<string>('');

  useEffect(() => {
    calculateCharges();
    updateTimeSpent();
  }, []);
  function calculateCharges() {
    const timeDiff = new Date().getTime() - Date.parse(details.time);
    const hours = Math.ceil(timeDiff / (1000 * 3600));
    const twoHourCharge = 10;
    let extraCharge = 0;
    if (hours > 2) {
      extraCharge = (hours - 2) * 10;
    }
    setCharges(twoHourCharge + extraCharge);
  }
  function updateTimeSpent() {
    const timeDiff = new Date().getTime() - Date.parse(details.time);
    const hours = Math.abs(Math.floor(timeDiff / (1000 * 3600)));
    const minutes = Math.abs(
      Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60)),
    );
    const timeSpentString = `${hours} hours ${minutes} minutes`;
    setTimeSpent(timeSpentString);
  }

  async function handlePayment() {
    const registration = details.reg;
    const charge = parkingCharge;
    try {
      const resultSet = await fetch(`https://httpstat.us/200`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'car-registration': registration,
          charge: charge,
        }),
      });
      if (resultSet.ok) {
        Alert.alert(`Payment Sucessful`);
        navigation.navigate('Parking Spaces', {numspaces: spaces});
      } else {
        Alert.alert('Payment Failed');
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <View style={styles.container}>
      {details && (
        <View>
          <Text>Car Registration: {details.reg}</Text>
          <Text>Time Spent: {timeSpent}</Text>
          <Text>Parking Charges: ${parkingCharge}</Text>
          <Button title="Payment Taken" onPress={handlePayment} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
