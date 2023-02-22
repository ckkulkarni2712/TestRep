import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import Base from '../Base';
import '@testing-library/jest-native/extend-expect';
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn().mockReturnValue({
      navigate: jest.fn(),
    }),
  };
});
const navigation = useNavigation<NativeStackNavigationProp<any>>();
describe('Base', () => {
  it('should enable button only when input is not empty', () => {
    const {getByPlaceholderText, getByTestId} = render(<Base />);
    const input = getByPlaceholderText('Enter the number of parking spaces');
    const button = getByTestId('submit-button');
    fireEvent.changeText(input, '5');
    expect(button).not.toBeDisabled();
  });

  it('should disable button if input is empty', () => {
    const {getByTestId} = render(<Base />);
    const button = getByTestId('submit-button');
    expect(button).toBeDisabled();
  });

  it('should navigate to Parking Spaces with numspaces when Submit is pressed', () => {
    const {getByTestId, getByPlaceholderText} = render(<Base />);
    const input = getByPlaceholderText('Enter the number of parking spaces');
    const button = getByTestId('submit-button');
    fireEvent.changeText(input, '10');
    fireEvent.press(button);
    expect(navigation.navigate).toHaveBeenCalledWith('Parking Spaces', {
      numspaces: '10',
    });
  });
});
