import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import '../styles/NavBar.css'
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from './SnackbarContext';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationModal from './NotificationModal';
import { Link } from 'react-router-dom';
import { Avatar } from '@mui/material';
import ProfileDrawer from './ProfileDrawer';

export default function Navbar() {
  const [openProfile, setOpenProfile] = React.useState(false);
  const navigate=useNavigate();
  const {showSnackbar}=useSnackbar();
  const [isManager,setIsManager]=React.useState(false);
  const [username,setUsername]=React.useState(" ");
  const [openNotification,setOpenNotification] = React.useState(false);

  React.useEffect(()=>{
     if(localStorage.getItem("user")!=null){
      setUsername(JSON.parse(localStorage.getItem('user')).username)
      setIsManager(JSON.parse(localStorage.getItem('user')).isManager);
     }
  },[]);

  const logoutHandler=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/login');
    showSnackbar("Logged out successfully","success");
  }


  return (
    <Box sx={{ flexGrow: 1}}>
    <AppBar position="static" sx={{backgroundColor:'#2E5C8A',display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
      <div>
        <Toolbar>
        {isManager&& (<Link to='/app/all-items'>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              All Items
          </Typography>
          </Link>)}
        {isManager&& (<Link to='/app/add-user'>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Add User
          </Typography>
          </Link>)}

          {isManager&& (<Link to='/app/manage-users'>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Manage users
          </Typography>
          </Link>)}

          {isManager||(<Link to='/app/generate-bill'>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Billing
          </Typography>
          </Link>)}


          <Link to='/app/about'>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              About
          </Typography>
          </Link>

        </Toolbar>
      </div>

      <div style={{display:'flex',flexDirection:'row',alignItems:'center'
      }}>
        <IconButton onClick={() => setOpenProfile(true)}>
          <Avatar>{username[0]}</Avatar>
        </IconButton>
        <IconButton className='logout-btn' onClick={()=>setOpenNotification(true)}>
          <NotificationsActiveIcon/>
        </IconButton>
        <NotificationModal openNotification={openNotification} setOpenNotification={setOpenNotification} />
        <IconButton className='logout-btn' onClick={logoutHandler}>
          <LogoutIcon/>
        </IconButton>
      </div>
    </AppBar>
    <ProfileDrawer openProfile={openProfile} setOpenProfile={setOpenProfile} />
  </Box>
  )
}