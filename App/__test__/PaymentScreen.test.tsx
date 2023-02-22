import React from 'react';
import PaymentScreen from '../PaymentScreen';
import {render, waitFor, fireEvent} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
declare var global: any;
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
describe('Payment Screen/Deregister Parking', () => {
  const mockMarkSpaceAsUnoccupied = jest.fn();
  const mockRoute = {
    params: {
      details: {
        reg: 'ABC123',
        time: '21-02-2023',
      },
      space: 1,
      markSpaceAsUnoccupied: mockMarkSpaceAsUnoccupied,
    },
  };
  it('Displays the time spent', () => {
    const details = {
      reg: 'ABC123',
      time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    };
    const route = {params: {details}};
    const {getByTestId} = render(<PaymentScreen route={route} />);
    const timeSpentElement = getByTestId('deregester-time-spent');
    console.log('timeSpentElement:', timeSpentElement.props.children[1]);
    expect(timeSpentElement).toHaveTextContent('Time Spent: 1 hours 0 minutes');
  });
  it('Shows parking charge', () => {
    const details = {
      reg: 'ABC123',
      time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    };
    const route = {params: {details}};
    const {getByTestId} = render(<PaymentScreen route={route} />);
    const parkingChargeElement = getByTestId('deregester-charge');
    expect(parkingChargeElement).toHaveTextContent('Parking Charges: $10');
  });
  it('calls markSpaceAsUnoccupied and navigates back to previous screen', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
      }),
    );
    const {getByTestId} = render(<PaymentScreen route={mockRoute} />);
    await waitFor(() => getByTestId('deregester-payment-button'));
    fireEvent.press(getByTestId('deregester-payment-button'));
    await waitFor(() =>
      expect(mockMarkSpaceAsUnoccupied).toHaveBeenCalledTimes(1),
    );
    expect(mockMarkSpaceAsUnoccupied).toHaveBeenCalledWith(1);
  });
  it('By Pressing the Go Back Button, it should navigate back to the pervious screen', () => {
    const goBack = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
      goBack,
    });

    const route = {
      params: {
        spaces: [],
        space: 1,
        details: {reg: 'ABC', time: '22-02-2023'},
        markSpaceAsUnoccupied: jest.fn(),
      },
    };
    const {getByTestId} = render(<PaymentScreen route={route} />);
    const goBackButton = getByTestId('deregester-back');
    fireEvent.press(goBackButton);

    expect(goBack).toHaveBeenCalled();
  });
});
