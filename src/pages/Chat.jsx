import React from "react";

import { useState } from "react";
import ChatBox from "../components/userAvatar/ChatBox";
import MyChats from "../components/userAvatar/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { useSelector } from "react-redux";
import { Box } from "@chakra-ui/layout";
import { ChatState } from "../components/Context/ChatProvider";

function Chat() {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
        bg="gray"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}

export default Chat;
