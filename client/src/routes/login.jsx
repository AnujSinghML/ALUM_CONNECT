// 
// client/routes/Login.jsx
import axios from 'axios';
import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
  const [formData, setFormData] = useState({ role: 'user', email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  // Create an axios instance with the base URL
  const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true // This is important for cookies/sessions
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      console.log(res.data);
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '1rem' }}>
      <Typography variant="h5">Login</Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select name="role" value={formData.role} label="Role" onChange={handleChange}>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }}>
          Login
        </Button>
      </form>
      <Typography variant="body2" style={{ marginTop: '1rem' }}>
        Forgot password? Please contact your college admin or alumni cell.
      </Typography>
    </div>
  );
};

export default Login;
