import axios from "axios";

import { SetPosts } from "../redux/postSlice";

const API_URL = "http://localhost:8800";

export const API = axios.create({
  baseURL: API_URL,
     headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userData')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    
    return Promise.reject(error);
  }
 
);

export const apiRequest = async ({ url, data, method, token }) => {
  try {
    const result = await API(url, {
      method: method || "GET",
      data: data,
    
    });
    return result?.data;
  } catch (error) {
    const err = error?.response?.data;
    console.log(err);
    return { status: err.success, message: err.message };
  }
};

export const handleFileUpload = async (uploadFile) => {
  const formData = new FormData();

  formData.append("file", uploadFile);
  formData.append(
    "upload_preset",
    uploadFile === "image" ? "socialmedia_image" : "socialmedia_video"
  );

  let resourceType = "auto";

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_ID}/${resourceType}/upload/`,
      formData
    );

    return response.data.secure_url;
  } catch (error) {}
};

export const fetchPosts = async (token, dispatch, uri, data) => {
  try {
    const res = await apiRequest({
      url: uri || "/posts",
      token: token,
      method: "POST",
      data: data || {},
    });
    console.log("check post are comming",res)
    dispatch(SetPosts(res?.data));
    return;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (id, token) => {
  try {
    const res = await apiRequest({
      url: "/posts/" + id,
      token: token,
      method: "DELETE",
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async ({ uri, token }) => {
  try {
    const res = await apiRequest({
      url: uri,
      token: token,
      method: "POST",
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getUserInfo = async (token, id) => {
  try {
    const uri = id === undefined ? "/users/get-user" : "/users/get-user/" + id;
    const res = await apiRequest({
      url: uri,
      token: token,
      method: "POST",
    });
    if (res?.message === "Authentication failed") {
      localStorage.removeItem("user");
      window.alert("User Session expired.Login again");
      window.location.replace("/login");
    }
    return res?.user;
  } catch (error) {
    console.log(error);
  }
};

// admin side
export const getUsersList = async () => {
  try {
    const users = await apiRequest({
      url: "/admin/userslist",
      method: "GET",
    });
    return users;
  } catch (error) {
    console.error(error.message);
  }
};





export const getUserPost = async () => {
  try {
    const posts = await apiRequest({
      url: "/admin/userspost",
      method: "GET",
    });
    return posts;
  } catch (error) {
    console.error(error.message);
  }
};

export const getReportedPost = async () => {
  try {
    const reportPost = await apiRequest({
      url: "/admin/reportedpost",
      method: "GET",
    });
    return reportPost;
  } catch (error) {
    console.error(error.message);
  }
};

export const blockUser = async (userId, action) => {
  try {
    const res = await apiRequest({
      url: `/admin/users/${userId}/block`,

      method: "POST",
      data: { action: action },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const blockPost = async (postId, action) => {
  try {
    const res = await apiRequest({
      url: `/admin/posts/${postId}/block`,

      method: "POST",
      data: { action: action },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const sendFriendRequest = async (token, id) => {
  try {
    const res = await apiRequest({
      url: "/users/friend-request",
      token: token,
      method: "POST",
      data: { requestTo: id },
    });
    return res;
  } catch (error) {
    const err = error.response.data;
    console.log(err);
    return { status: err.success, message: err.message };
  }
};

export const usersuggestions = async (token, input) => {
  try {
    const res = await apiRequest({
      url: `/users/user-suggestions?search=${input}`,
      method: "GET",
      token: token,
    });
    return res;
  } catch (error) {
    const err = error.response.data;
    console.log(err);
    return { status: err.success, message: err.message };
  }
};
