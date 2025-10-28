import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userToken: 'tes',
};

export const userSlice = new createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setLogin: (state, action) => {
        state.userToken = action.payload;
    },
    setLogout: (state,action) => {
        state.userToken = null;
    }
  }
});

export const { setLogin,setLogout } = userSlice.actions; // dipakai di file tujuan misal app.jsx
export default userSlice.reducer; // untuk dipakai di storage
