import { configureStore } from "@reduxjs/toolkit";
import ParkingLot from "../Reducer/ParkingLot";

const store = configureStore({
    reducer: {
        parkingLot: ParkingLot,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;