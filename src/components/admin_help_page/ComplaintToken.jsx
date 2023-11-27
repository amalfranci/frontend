import React from 'react'
import Sidenav from '../admin_help_page/Sidenav'
import Box from '@mui/material/Box';
import Navbar from '../admin_help_page/navbar/Navbar';


 export default function ComplaintToken() {
  return (
      <>
      <Navbar />
      <Box height={50}/>
      <Box sx={{ display: 'flex' }}>
           <Sidenav />
     
        
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
             <h1 >Token</h1>
      
        
      </Box>
   </Box>
   
    </>
  )
}



 