import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminInfo: localStorage.getItem("adminInfo")
    ? JSON.parse(localStorage.getItem("adminInfo"))
    : null,
  edit: false,
};

const adminSlice = createSlice({
  name: "adminInfo",
  initialState,
  reducers: {
    login(state, action) {
      state.adminInfo = action.payload;
      localStorage.setItem("adminInfo", JSON.stringify(action.payload));
    },
    logout(state) {
      state.adminInfo = null;
      localStorage.removeItem("adminInfo");
    },
  },
});

export default adminSlice.reducer;

// admin login

export function AdminLogin(adminInfo) {
  return (dispatch, getState) => {
    dispatch(adminSlice.actions.login(adminInfo));
  };
}

export function AdminLogout() {
  return (dispatch, getState) => {
    dispatch(adminSlice.actions.logout());
  };
}
