import React from 'react'
import Sidenav from '../admin_help_page/Sidenav'
import Box from '@mui/material/Box';
import Navbar from '../admin_help_page/navbar/Navbar';
import Userlist from './UserList/UsersList';


 export default function Userpage() {
  return (
    <>
      <Navbar />
        <Box height={70}/>
      <Box sx={{ display: 'flex' }}>
           <Sidenav />
     
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
         <Userlist/>
          
      
        
      </Box>
   </Box>
   
    </>
  )
}



 