import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  CircularProgress,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { BASEURL } from './config';
import { useSnackbar } from './SnackbarContext';

const UsersManagement = () => {
  const { showSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token=localStorage.getItem("token");
      const res = await axios.get(BASEURL + 'user/get-all-users',{
            headers:{
              'Authorization': `Bearer ${token}`
            }
          });
      setUsers(res.data.users);
    } catch (err) {
      showSnackbar('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;
    try {
      const token=localStorage.getItem("token");
      await axios.delete(BASEURL + `user/delete-user/${id}`,{
            headers:{
              'Authorization': `Bearer ${token}`
            }
        });
      setUsers((prev) => prev.filter((user) => user._id !== id));
      showSnackbar('User deleted successfully', 'success');
    } catch (err) {
      showSnackbar('Failed to delete user', 'error');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box sx={{ px: 4, py: 4 }}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          User Management
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ color: 'white' }}>Avatar</TableCell>
                  <TableCell sx={{ color: 'white' }}>Username</TableCell>
                  <TableCell sx={{ color: 'white' }}>Full Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white' }}>Role</TableCell>
                  <TableCell align="right" sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Avatar>{user.fullName?.charAt(0)?.toUpperCase() || 'U'}</Avatar>
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>
                      {user.isManager ? (
                        <Typography color="primary" fontWeight="bold">Admin</Typography>
                      ) : (
                        <Typography color="text.secondary">Clerk</Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete User">
                        <IconButton color="error" onClick={() => handleDelete(user._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default UsersManagement;
