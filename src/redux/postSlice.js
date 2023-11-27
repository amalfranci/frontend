import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: {},
  edited: false, // Add 'edited' property with an initial value
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    getPosts(state, action) {
      state.posts = action.payload;
    },
    updatePost(state, action) {
      state.edited = action.payload;
    },
  },
});

export default postSlice.reducer;

export function SetPosts(post) {
  return (dispatch, getState) => {
    dispatch(postSlice.actions.getPosts(post));
  };
}

export function UpdatePost(val) {
  return (dispatch, getState) => {
    dispatch(postSlice.actions.updatePost(val));
  };
}
