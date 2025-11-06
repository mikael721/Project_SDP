import { configureStore } from "@reduxjs/toolkit";
import userSlice from './userSlice'
import menuSlice from './menuSlice'

const store = configureStore({
  reducer: {
    user: userSlice,
    menu: menuSlice
  },
});

export default store;
