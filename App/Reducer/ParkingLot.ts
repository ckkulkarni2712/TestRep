import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ParkingLotState {
  numSpaces: number;
  occupiedSpaces: number;
  parkingSpaces: { [key: number]: { registration: string, parkedTime: number } }
}

const initialState: ParkingLotState = {
  numSpaces: 0,
  occupiedSpaces: 0,
  parkingSpaces: {}
};

const parkingLotSlice = createSlice({
  name: 'parkingLot',
  initialState,
  reducers: {
    initializeParkingLot(state, action: PayloadAction<number>) {
      state.numSpaces = action.payload;
    },
    occupyParkingSpace(state, action: PayloadAction<{ spaceNum: number, registration: string, parkedTime: number }>) {
      const { spaceNum, registration, parkedTime } = action.payload;
      state.parkingSpaces[spaceNum] = { registration, parkedTime };
      state.occupiedSpaces++;
    },
    deallocateParkingSpace(state, action: PayloadAction<number>) {
      const spaceNum = action.payload;
      delete state.parkingSpaces[spaceNum];
      state.occupiedSpaces--;
    }
  }
});

export const { initializeParkingLot, occupyParkingSpace, deallocateParkingSpace } = parkingLotSlice.actions;

export default parkingLotSlice.reducer;
