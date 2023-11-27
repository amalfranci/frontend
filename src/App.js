import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Home, Login, Profile, Register, ResetPassword } from "./pages";
import Adminlogin from "./components/adminpage/AdminLogin";
import { AdminHome } from "./components/adminpage/AdminHome";
import { useSelector } from "react-redux/es/hooks/useSelector";
import PostList from "./components/admin_help_page/PostList";
import Chat from "./pages/Chat";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChakraProvider } from '@chakra-ui/react'




import UserPage from "./components/admin_help_page/UserPage";
import ComplaintToken from "./components/admin_help_page/ComplaintToken";
import ChatProvider from "./components/Context/ChatProvider";
import VideoChat from "./pages/VideoChat";
import Room from "./components/miscellaneous/VideoCall/Room";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const loaction = useLocation();


  return user?.token  ? (<>
   <ChatProvider>
    <ChakraProvider>
    <ToastContainer/>
      <Outlet />
      </ChakraProvider>
      </ChatProvider>
    </>

  ) : (
    <Navigate to="/login" state={{ from: loaction }} replace />
  );
}

function Adminlayout() {
  const adminInfo = useSelector((state) => state.admin.adminInfo);

  const adminloaction = useLocation();

  return adminInfo ? (
    <Outlet />
  ) : (
    <Navigate to="/adminlogin" state={{ from: adminloaction }} replace />
  );
}

function App() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">

      <Routes> 
        <Route element={<Layout />}>
        
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id?" element={<Profile />} />
          <Route path="/chats" element={<Chat />} />
          <Route path="/videochat" element={<VideoChat />} />
          <Route path="/room/:roomId" element={<Room/>}/>
          
        </Route>
         

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/adminlogin" element={<Adminlogin />} />
       

        {/* admin route */}
        <Route element={<Adminlayout />}>
          <Route path="/adminHome" element={<AdminHome />} />
          <Route path="/userlist" element={<UserPage />} />
          <Route path="/token" element={<ComplaintToken />} />
          <Route path="/posts" element={<PostList />} />
          
        </Route>
      </Routes>
    </div>
  );
}

export default App;
