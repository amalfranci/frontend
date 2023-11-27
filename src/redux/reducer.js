import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import themeSlice from "./theme";
import postSlice from "./postSlice";
import adminSlice from "./adminSlice";

const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice,
  posts: postSlice,
  admin: adminSlice
});

export { rootReducer }