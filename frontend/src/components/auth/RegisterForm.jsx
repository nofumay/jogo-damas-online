import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
  Grid
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { register, resetAuthError } from '../../redux/slices/authSlice';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validação do formulário com Formik + Yup
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      nomeCompleto: '',
      senha: '',
      confirmSenha: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'O nome de usuário deve ter pelo menos 3 caracteres')
        .max(20, 'O nome de usuário deve ter no máximo 20 caracteres')
        .required('Nome de usuário é obrigatório'),
      email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
      nomeCompleto: Yup.string()
        .required('Nome completo é obrigatório'),
      senha: Yup.string()
        .min(6, 'A senha deve ter pelo menos 6 caracteres')
        .required('Senha é obrigatória'),
      confirmSenha: Yup.string()
        .oneOf([Yup.ref('senha'), null], 'As senhas devem coincidir')
        .required('Confirmar senha é obrigatório'),
    }),
    onSubmit: (values) => {
      const { confirmSenha, ...userData } = values;
      dispatch(register(userData));
    },
  });

  // Limpa mensagens de erro quando o usuário começa a digitar
  React.useEffect(() => {
    if (error) {
      const handler = setTimeout(() => {
        dispatch(resetAuthError());
      }, 5000);

      return () => clearTimeout(handler);
    }
  }, [error, dispatch]);

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
        Criar Conta
      </Typography>
      
      <Typography variant="body1" align="center" color="text.secondary" paragraph>
        Junte-se a nós e comece a jogar damas online com pessoas do mundo todo!
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="username"
              label="Nome de Usuário"
              name="username"
              autoComplete="username"
              autoFocus
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="nomeCompleto"
              label="Nome Completo"
              name="nomeCompleto"
              autoComplete="name"
              value={formik.values.nomeCompleto}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nomeCompleto && Boolean(formik.errors.nomeCompleto)}
              helperText={formik.touched.nomeCompleto && formik.errors.nomeCompleto}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="senha"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              id="senha"
              autoComplete="new-password"
              value={formik.values.senha}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.senha && Boolean(formik.errors.senha)}
              helperText={formik.touched.senha && formik.errors.senha}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="confirmSenha"
              label="Confirmar Senha"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmSenha"
              autoComplete="new-password"
              value={formik.values.confirmSenha}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmSenha && Boolean(formik.errors.confirmSenha)}
              helperText={formik.touched.confirmSenha && formik.errors.confirmSenha}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Registrar'}
        </Button>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link component={RouterLink} to="/login" variant="body2">
            {"Já tem uma conta? Faça login"}
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};

export default RegisterForm;