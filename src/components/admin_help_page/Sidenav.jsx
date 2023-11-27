import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';

import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';

import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';







import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from './navbar/appStore.jsx';
import { IconButton } from '@mui/material';


const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));



const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Sidenav() {
  const theme = useTheme();
    // const [open, setOpen] = React.useState(true);
    const navigate = useNavigate()
    //  const updateOpen = useAppStore((state) => state.updateOpen)
       const open=useAppStore((state)=>state.dopen)





  return (
    <Box sx={{ display: 'flex' }} >

      <CssBaseline />
    
      
      <Drawer variant="permanent" open={open}>
        <IconButton >
          {theme.direction === "rtl" ? (
            <ChevronRightIcon/>
          ):(<ChevronLeftIcon/>)}
        </IconButton>
      
        <Divider />
              <List>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/adminHome")}}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                pt:6
                
                   
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                 <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="DashBoard" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
                  </ListItem>
                  

                   <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/userlist")}}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                    
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                 <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Userlist" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
                  </ListItem>

          
<ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/posts")}} >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                  
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                 <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Postlist" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>


      
        </List>
       
       
      </Drawer>
     
    </Box>
  );
}
