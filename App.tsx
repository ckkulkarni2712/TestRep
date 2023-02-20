import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Base from './App/Base';
import store from './App/Store';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ParkingSpace from './App/ParkingSpace';
import {Provider} from 'react-redux';
import PaymentScreen from './App/PaymentScreen';
function App(): JSX.Element {
  const stack = createNativeStackNavigator();
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <stack.Navigator>
            <stack.Screen name="Home Screen" component={Base} />
            <stack.Screen name="Parking Spaces" component={ParkingSpace} />
            <stack.Screen name="Payment" component={PaymentScreen} />
          </stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});
export default App;
