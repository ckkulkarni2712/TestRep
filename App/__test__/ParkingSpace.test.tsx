import React from 'react';
import ParkingSpace from '../ParkingSpace';
import {render, fireEvent} from '@testing-library/react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import '@testing-library/jest-native/extend-expect';
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn().mockReturnValue({
      navigate: jest.fn(),
    }),
  };
});
const navigation = useNavigation<NativeStackNavigationProp<any>>();
describe('ParkingSpace component', () => {
  it('Renders correct number of parking spaces', () => {
    const route = {params: {numspaces: 3}};
    const {getAllByTestId} = render(<ParkingSpace route={route} />);
    const parkingSpaces = getAllByTestId(/parking-space-\d+/);
    expect(parkingSpaces.length).toBe(3);
  });

  it('Clicking on an unoccupied parking space shows parking form', () => {
    const route = {params: {numspaces: 1}};
    const {getByTestId, getByPlaceholderText, getByText, queryByTestId} =
      render(<ParkingSpace route={route} />);
    const parkingSpace = getByTestId('parking-space-1');
    fireEvent.press(parkingSpace);
    const parkingTimeButton = getByText('Parking Time (tap to change)');
    const carRegistrationInput = getByPlaceholderText(
      'Enter vehicle registration',
    );
    expect(parkingTimeButton).toBeTruthy();
    expect(carRegistrationInput).toBeTruthy();
    const closeButton = getByText('Close');
    fireEvent.press(closeButton);
    const selectedParkingSpace = queryByTestId('selected-parking-space');
    expect(selectedParkingSpace).toBeFalsy();
  });

  it('Submitting parking form marks parking space as occupied', () => {
    const route = {params: {numspaces: 1}};
    const {getByTestId, getByPlaceholderText, getByText, queryByText} = render(
      <ParkingSpace route={route} />,
    );
    const parkingSpace = getByTestId('parking-space-1');
    fireEvent.press(parkingSpace);
    const carRegistrationInput = getByPlaceholderText(
      'Enter vehicle registration',
    );
    const submitButton = getByText('Submit');
    fireEvent.changeText(carRegistrationInput, 'ABC123');
    fireEvent.press(submitButton);
    const occupiedSpace = getByTestId('parking-space-1');
    expect(occupiedSpace).toHaveStyle({backgroundColor: '#EFEFEF'});
    const parkingDetails = getByTestId('parking-space-1').props.children;
    console.log(parkingDetails[0].props.children[1].props.children);
    expect(parkingDetails[0].props.children[1].props.children).toBe('ABC123');
  });

  it('Clicking on an occupied parking space opens payment screen', () => {
    const route = {params: {numspaces: 1}};
    const {getByTestId, getByPlaceholderText, getByText} = render(
      <ParkingSpace route={route} />,
    );
    const parkingSpace = getByTestId('parking-space-1');
    fireEvent.press(parkingSpace);
    const carRegistrationInput = getByPlaceholderText(
      'Enter vehicle registration',
    );
    const submitButton = getByText('Submit');
    fireEvent.changeText(carRegistrationInput, 'ABC123');
    fireEvent.press(submitButton);
    fireEvent.press(parkingSpace);
  });
});
