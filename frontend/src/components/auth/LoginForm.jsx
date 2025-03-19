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
  Alert
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { login, resetAuthError } from '../../redux/slices/authSlice';

const LoginForm = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Validação do formulário com Formik + Yup
  const formik = useFormik({
    initialValues: {
      username: '',
      senha: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required('Nome de usuário é obrigatório'),
      senha: Yup.string()
        .required('Senha é obrigatória'),
    }),
    onSubmit: (values) => {
      dispatch(login(values));
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
    <Paper elevation={3} sx={{ maxWidth: 500, mx: 'auto', p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
        Entrar
      </Typography>
      
      <Typography variant="body1" align="center" color="text.secondary" paragraph>
        Faça login para jogar damas online com amigos!
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <TextField
          margin="normal"
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
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="senha"
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          id="senha"
          autoComplete="current-password"
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
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Entrar'}
        </Button>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link component={RouterLink} to="/register" variant="body2">
            {"Não tem uma conta? Cadastre-se"}
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};

export default LoginForm;