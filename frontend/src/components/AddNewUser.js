import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { BASEURL } from './config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from './SnackbarContext';

const AddNewUser = () => {
   const {showSnackbar}=useSnackbar();
   const navigate=useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data);
    const reqData={
      username:data.get("username"),
      fullName:data.get("fullName"),
      password:data.get("password"),
      email: data.get("email"),
      isManager: data.get("isManager")==="on"
    }
    console.log(reqData);
    try{
      const createUserURL = BASEURL+"user/create-user";
      const res=await axios.post(createUserURL,reqData);
      showSnackbar("New created successfully","success");
    }catch(err){
      showSnackbar(err.response.data.message,"error");
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={5}>
        <Paper elevation={6} sx={{ p: 4, mt: 4, borderRadius: 4 }}>
          <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
            Add New User
          </Typography>
          {/* We've removed autoComplete from the form itself as it's more effective on the inputs */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              name="username"
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
              required
              // A common technique to trick the browser's autofill
              autoComplete="off" 
            />
            <TextField
              fullWidth
              margin="normal"
              label="Full Name"
              name="fullName"
              variant="outlined"
              value={formData.fullName}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              variant="outlined"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              variant="outlined"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              // This is the key for new password fields
              autoComplete="new-password"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isManager}
                  onChange={handleChange}
                  name="isManager" // Name must match the state key
                  color="primary"
                />
              }
              label="Make this user a Admin"
              sx={{ mt: 2 }} // Add some top margin for spacing
            />

            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ px: 4, py: 1.2, borderRadius: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Add User'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AddNewUser;