import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
export default function PaymentScreen({route}: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {spaces, space, details, markSpaceAsUnoccupied} = route.params;
  const [parkingCharge, setCharges] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<string>('0 hours 0 minutes');
  useEffect(() => {
    calculateCharges();
  }, [details]);
  function calculateCharges() {
    const timeDiff = new Date().getTime() - Date.parse(details.time);
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.abs(
      Math.abs(Math.ceil((timeDiff % (1000 * 3600)) / (1000 * 60))),
    );
    const twoHourCharge = 10;
    let extra = 0;
    if (hours > 2) {
      extra = (hours - 1) * 10;
    }
    setCharges(twoHourCharge + extra);
    updateTimeSpent(hours, minutes);
  }
  function updateTimeSpent(hours: number, minutes: number) {
    if (minutes > 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }
    if (minutes > 0) {
      minutes -= 1;
    }
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
        markSpaceAsUnoccupied(space);
        navigation.goBack();
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
          <View style={styles.buttonStyle2}>
            <Button
              color="#0551B4"
              title="Go Back"
              onPress={() => {
                navigation.goBack();
              }}
              testID="deregester-back"
            />
          </View>
          <View style={styles.details}>
            <Text style={styles.textStyle}>
              Car Registration: {details.reg}
            </Text>
            <Text testID="deregester-time-spent" style={styles.textStyle}>
              Time Spent: {timeSpent}
            </Text>
            <Text testID="deregester-charge">
              Parking Charges: ${parkingCharge}
            </Text>
          </View>
          <View style={styles.buttonStyle1}>
            <Button
              color="#0551B4"
              title="Payment Taken"
              onPress={handlePayment}
              testID="deregester-payment-button"
            />
          </View>
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
  details: {
    borderWidth: 2,
    borderColor: '#CBD8F5',
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 20,
    color: 'black',
  },
  buttonStyle1: {
    paddingTop: 10,
  },
  buttonStyle2: {
    paddingBottom: 10,
    width: 100,
  },
  textStyle: {
    borderBottomColor: '#EFF2FB',
    borderBottomWidth: 1.3,
    paddingBottom: 3,
  },
});
