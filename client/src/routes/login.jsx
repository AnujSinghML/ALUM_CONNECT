import axios from 'axios';
import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ role: 'user', email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      console.log(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Box 
      sx={{
          width: '100%',
          maxWidth: '400px',
          padding: '2.5rem',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          mx: 'auto',  // Horizontal center
          my: 4,       // Vertical margin
        }}
    >
      {/* Logo Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
          <img 
            src="src/img/connect_logo_black.png" 
            alt="AlumConnect Logo" 
            style={{ 
              width: '80px',
              marginBottom: '1.5rem',
              marginLeft: '7.5rem'
            }} 
          />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600,
              color: '#1e40af',
              mb: 1
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ color: '#6b7280' }}
          >
            Please sign in to continue
          </Typography>
        </Box>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={formData.role}
            label="Role"
            onChange={handleChange}
            sx={{ borderRadius: '8px' }}
          >
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
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
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
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
        />

        {error && (
          <Typography 
            color="error" 
            sx={{ mb: 2, textAlign: 'center' }}
          >
            {error}
          </Typography>
        )}

        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          sx={{
            py: 1.5,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '1rem',
            backgroundColor: '#2563eb',
            '&:hover': {
              backgroundColor: '#1d4ed8',
            },
          }}
        >
          Sign In
        </Button>
      </form>

      <Typography 
        variant="body2" 
        sx={{ 
          mt: 3,
          color: '#6b7280',
          textAlign: 'center'
        }}
      >
        Forgot password? Please contact your college admin or alumni cell.
      </Typography>
    </Box>
  );
};

export default Login;
