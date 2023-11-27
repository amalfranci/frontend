import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client"


const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    setUser(userInfo);
  }, []);

  const socket=useMemo(()=>io("localhost:8800"),[])

  return (
    <ChatContext.Provider
      value={{
        socket,
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
