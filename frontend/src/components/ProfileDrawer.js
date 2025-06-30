import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, Drawer, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { useSnackbar } from './SnackbarContext';
import { BASEURL } from './config';

export default function ProfileDrawer({openProfile,setOpenProfile}) {
  const {showSnackbar}=useSnackbar(); 
  const [changePass,setChangePass]=useState(false);
  const [newPassword,setNewPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [oldPassword,setOldPassword]=useState("");
  const handleUpdatePassword=async()=>{
    try{
      if(!oldPassword||oldPassword==""||!newPassword||newPassword==""||!confirmPassword||confirmPassword==""){
        showSnackbar("Provide all details","error");
        return;
      }
      if(newPassword!=confirmPassword){
        showSnackbar("Confirm Password not matched","error");
        return;
      }
      const passowrdUpdateUrl=BASEURL+"user/update-password";
      const reqData={
        oldPassword:oldPassword,
        newPassword:newPassword
      }
      const token=localStorage.getItem("token");
      const res=await axios.post(passowrdUpdateUrl,reqData,{
        headers:{
            'Authorization': `Bearer ${token}`
          }
      });
      if(res.status) showSnackbar("Password updates successfully!","success");
      else showSnackbar(res.statusText,"error");
    }catch(err){
      showSnackbar(err.response.data.message,"error");
    }
  }
  return (
    <Drawer anchor="right" open={openProfile} onClose={() => setOpenProfile(false)}>
      <Box sx={{ width: 350, p: 3}} role="presentation">
        <Typography variant="h5" gutterBottom>My Profile</Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="body1"><strong>Name:</strong> {JSON.parse(localStorage.getItem('user'))?.fullName}</Typography>
        <Typography variant="body1"><strong>Username:</strong> {JSON.parse(localStorage.getItem('user'))?.username}</Typography>
        <Typography variant="body1"><strong>Role:</strong> {JSON.parse(localStorage.getItem('user'))?.isManager ? "Admin" : "Cashier"}</Typography>

        <Divider sx={{ mb: 2 }} />

        <Accordion sx={{marginTop:2}}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">Change Password</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              label="Old Password"
              type="password"
              margin="normal"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button onClick={handleUpdatePassword}>Update Password</Button>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Drawer>

  )
}
