import React from 'react'
import Sidenav from './Sidenav';
import Box from '@mui/material/Box';
import Navbar from './navbar/Navbar';
import Postdata from "./posts/Postdata"


 export default function PostList() {
  return (
      <>
      <Navbar />
      <Box height={50}/>
      <Box sx={{ display: 'flex' }}>
           <Sidenav />
     
        
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Postdata/>
          
      
        
      </Box>
   </Box>
   
    </>
  )
}



 