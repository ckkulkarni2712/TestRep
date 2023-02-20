import React, {useState} from 'react';
import {View} from 'react-native';
import {
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export default function ParkingSpace({route}: any) {
  const {numspaces} = route.params;
  const [details, setDetails] = useState<
    Array<{
      selected: number;
      time: Date;
      reg: string;
    } | null>
  >(Array(numspaces).fill(null));

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [selectedSpace, setSelected] = useState(0);
  const [showPicker, setPicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [reg, setReg] = useState('');
  const [parkingSpaces, setParkingSpaces] = useState(() => {
    const spaces = [];
    for (let i = 1; i <= numspaces; i++) {
      spaces.push(i);
    }
    return spaces;
  });
  const handleAddParkingSpace = () => {
    setParkingSpaces(spaces => [...spaces, spaces.length + 1]);
  };
  function handleSelected(space: number) {
    const occupied =
      details[space - 1] && details[space - 1]?.selected === space;
    if (occupied) {
      navigation.navigate('Payment', {
        spaces: numspaces,
        space: space,
        details: {
          time: details[space - 1]?.time,
          reg: details[space - 1]?.reg,
        },
        markSpaceAsUnoccupied: (space: number) => markSpaceAsUnoccupied(space),
      });
    } else {
      setSelected(space);
    }
  }

  function handleParkVehicle(selectedSpace: number) {
    const newDetails = [...details];
    newDetails[selectedSpace - 1] = {
      selected: selectedSpace,
      time: time,
      reg: reg,
    };
    setDetails(newDetails);
  }

  const setVehicleRegistration = (text: string) => {
    setReg(text);
  };
  const hidePicker = () => {
    setPicker(false);
  };

  const setParkingTime = (selectedTime: Date) => {
    setTime(selectedTime);
    hidePicker();
  };
  function markSpaceAsUnoccupied(space: number) {
    const newDetails = [...details];
    newDetails[space - 1] = null;
    setDetails(newDetails);
  }

  return (
    <ScrollView contentContainerStyle={styles.container} horizontal={true}>
      <TouchableOpacity
        style={styles.buttonStyling1}
        onPress={handleAddParkingSpace}>
        <Text>Create New Parking</Text>
      </TouchableOpacity>
      {parkingSpaces.map(space => (
        <TouchableOpacity
          onPress={() => handleSelected(space)}
          key={space}
          style={styles.parkingSpace}>
          {details[space - 1] && details[space - 1]?.selected === space ? (
            <View style={styles.spaceDetails}>
              <Text style={{color: 'white'}}>{space}</Text>
              <Text style={{color: 'white'}}>{details[space - 1]?.reg}</Text>
              <Text style={{color: 'white'}}>
                {details[space - 1]?.time.toLocaleTimeString()}
              </Text>
            </View>
          ) : (
            <Text style={styles.parkingNumber}>{space}</Text>
          )}
        </TouchableOpacity>
      ))}

      {selectedSpace > 0 && (
        <View style={styles.formContainer}>
          <Text>{reg}</Text>
          <DateTimePickerModal
            isVisible={showPicker}
            mode="time"
            onConfirm={setParkingTime}
            onCancel={() => hidePicker()}
          />
          <Text>Parking Time (tap to change)</Text>
          <TouchableOpacity
            style={styles.setTimeButton}
            onPress={() => {
              setPicker(true);
            }}>
            <Text>{time.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          <Text>Car Registration</Text>
          <TextInput
            placeholder="Enter vehicle registration"
            onChangeText={setVehicleRegistration}
            style={styles.formInput}
          />
          <TouchableOpacity
            onPress={() => handleParkVehicle(selectedSpace)}
            style={styles.buttonStyling2}>
            <Text style={{color: 'white'}}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonStyling2}
            onPress={() => {
              setSelected(0);
              setVehicleRegistration('');
              setParkingTime(new Date());
            }}>
            <Text style={{color: 'white'}}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#F5EFEF',
  },
  parkingSpace: {
    width: 110,
    backgroundColor: '#EFEFEF',
    height: 85,
    borderWidth: 2.5,
    borderStyle: 'dotted',
    borderColor: '#49C78C',
    margin: 5,
    marginHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  parkingNumber: {
    fontSize: 20,
  },
  buttonStyling1: {
    top: 0,
    position: 'absolute',
    padding: 10,
    backgroundColor: '#E1EDF8',
  },
  formInput: {
    marginTop: 7,
    width: '100%',
    height: 33,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 7,
    flex: 1,
    textAlign: 'center',
  },
  formContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 1,
  },
  buttonStyling2: {
    marginTop: 5,
    backgroundColor: '#0551B4',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
    borderRadius: 5,
  },
  setTimeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    padding: 5,
  },
  spaceDetails: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0551B4',
    padding: 25,
  },
});
