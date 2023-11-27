import React, { useEffect, useState } from "react";
import Navbar from "../admin_help_page/navbar/Navbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Sidenav from "../admin_help_page/Sidenav";
import { apiRequest } from "../../utils";
import Graph from "../admin_help_page/Chart/Graph";

export function AdminHome() {
  const [count, setCount] = useState('');
  const [usersPerMonth, setUsersPermonth] = useState([]);

  const convertToMonthName = (monthNumber) => {
    const months = [
      null,
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthNumber];
  };

  useEffect(() => {
    async function fetchUserCount() {
      try {
        const usersCount = await apiRequest({
          url: "/admin/user-count",
          method: "GET",
        });
        setCount(usersCount.totalCount);
        setUsersPermonth(usersCount.usersPerMonth);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchUserCount();
  }, []);

  const chartData = Array.from(
    { length: 12 },
    (_, i) => usersPerMonth.find((item) => item._id === i + 1)?.count || 0
  );
  const labels = Array.from({ length: 12 }, (_, i) =>
    convertToMonthName(i + 1)
  );

  return (
    <>
      <Navbar />
      <Box height={70}  width={30}/>
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={0}>
            <Grid item xs={3}>
              <Card sx={{ maxWidth: 49 + "%", height: 140 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Total Members
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: '24px', textAlign: 'center' }}
                  >
                    {count}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <div className="h-[500px] w-[600px]">
            <Graph chartData={chartData} labels={labels} />
          </div>
        </Box>
      </Box>
    </>
  );
}
