import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    access_token: null,
    isAuthenticated: false,
    isLoading: true, // Add isLoading to auth state
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.access_token = action.payload;
    },
    setLogout: (state) => {
      state.access_token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setAuthSuccess: (state, action) => {
      state.access_token = action.payload.access_token;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setAuthLoading: (state) => {
      state.isLoading = true;
    },
  },
});

export const { setAccessToken, setLogout, setAuthSuccess, setAuthLoading } =
  authSlice.actions;
export default authSlice.reducer;

// Async logout action to purge persisted state
export const logout = () => (dispatch) => {
  dispatch(setLogout());
  dispatch({ type: PURGE, key: "root", result: () => null });
  localStorage.removeItem("access_token");
};
