import * as React from 'react';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { blockPost, getUserPost,getReportedPost } from '../../../utils';
import swal from 'sweetalert'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function Postlist() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState([]);
      const [filterPost, setFilterPost] = useState('All');

  useEffect(() => {
     fetchPosts();
  }, [filterPost]);
    
      const handleChange = (event) => {
    setFilterPost(event.target.value);
  };

const fetchPosts = async () => {
  try {
    if (filterPost === 'All') {
      const allPosts = await getUserPost();
      setRows(allPosts?.posts || []);
    } else if (filterPost === 'Reported') {
      const reportedPosts = await getReportedPost();
        setRows(reportedPosts?.data || []);
    
    }
  } catch (error) {
    console.error(error);
  }
};

  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleBlockPost= async (postId, currentStatus) => {
  try {
    // Use SweetAlert to display a confirmation dialog
    swal({
      title: `Are you sure you want to ${currentStatus === "blocked" ? "active" : "block"} this user?`,
  
      icon: "warning",
      buttons: ["Cancel", "Confirm"],
      dangerMode: true,
    })
    .then(async (confirmed) => {
      if (confirmed) {
        const action = currentStatus === "blocked" ? "active" : "block";

          const response = await blockPost(postId, action);
          console.log("check block",response)

        if (response && response.post) {
          // Assuming your server returns the updated user data, you can update the local state accordingly
            const updatedRows = rows.map((row) =>
              
            row._id === postId
              ? { ...row, status: response.post.status }
              : row
          );
          setRows(updatedRows);
        } else {
          // Handle the case where the response is not successful
          console.error(`Failed to ${action} the user.`);
        }
      } else {
        // User canceled the action
        console.log("Action canceled");
      }
    });
  } catch (error) {
    console.error(error.message);
  }
};


  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
   
    
   
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        sx={{ padding: "20px" }}
      >
        User's Post
          </Typography>
         <Box sx={{ minWidth: 120 }}>
      <FormControl style={{ width: '200px' }}>
        <InputLabel id="demo-simple-select-label">All</InputLabel>
     <Select
  labelId="demo-simple-select-label"
  id="demo-simple-select"
  value={filterPost}
  label="All"
  onChange={handleChange}
>
    <MenuItem value="All">All</MenuItem>
            <MenuItem value="Reported">Reported</MenuItem>
          
        </Select>
      </FormControl>
    </Box>
      
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Post ID
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                User 
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
              Created At
              </TableCell>
              {/* <TableCell align="left" style={{ minWidth: "100px" }}>
           Description     
              </TableCell> */}
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow key={row._id} hover role="checkbox" tabIndex={-1}>
                        <TableCell align="left">{row._id}</TableCell>
                      <TableCell align="left">{row.userId.firstName} {row.userId.lastName}</TableCell>

                        
                    <TableCell align="left">{formatDate(row.createdAt)}</TableCell>
                        {/* <TableCell align="left">{row.description}</TableCell> */}
                  
                    <TableCell align="left">
                    <Button
  variant="contained"
  color="error"
  onClick={() => handleBlockPost(row._id, row.status)} // Pass the current status
>
  {row.status === "blocked" ? "Unblock" : "Block"}
</Button>

                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
