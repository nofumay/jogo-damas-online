import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // Redirecionar se o usuário já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 5 }}>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default LoginPage;