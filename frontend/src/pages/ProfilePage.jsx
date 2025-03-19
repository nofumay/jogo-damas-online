import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Avatar,
  Divider,
  CircularProgress,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FaceIcon from '@mui/icons-material/Face';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import { fetchUserProfile, updateUserProfile } from '../redux/slices/userSlice';
import { fetchMyGames } from '../redux/slices/gameSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, isLoading, error } = useSelector((state) => state.user);
  const { myGames } = useSelector((state) => state.game);
  const [editMode, setEditMode] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Buscar dados do perfil e jogos
  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchMyGames());
  }, [dispatch]);

  // Limpa mensagem de sucesso após 3 segundos
  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  // Formik para o formulário de edição
  const formik = useFormik({
    initialValues: {
      nomeCompleto: profile?.nomeCompleto || '',
      email: profile?.email || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      nomeCompleto: Yup.string().required('Nome completo é obrigatório'),
      email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    }),
    onSubmit: (values) => {
      dispatch(updateUserProfile(values))
        .unwrap()
        .then(() => {
          setEditMode(false);
          setUpdateSuccess(true);
        })
        .catch((err) => {
          console.error('Erro ao atualizar perfil:', err);
        });
    },
  });

  // Calcula a taxa de vitórias
  const getWinRate = () => {
    if (!profile) return '0%';
    const totalGames = profile.partidasJogadas || 0;
    if (totalGames === 0) return '0%';
    
    const winRate = ((profile.partidasVencidas || 0) / totalGames) * 100;
    return `${winRate.toFixed(1)}%`;
  };

  // Filtra jogos recentes
  const getRecentGames = () => {
    if (!myGames) return [];
    return myGames
      .sort((a, b) => new Date(b.dataInicio) - new Date(a.dataInicio))
      .slice(0, 5);
  };

  if (isLoading && !profile) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 3 }}
        >
          Voltar ao painel
        </Button>

        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Meu Perfil
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {updateSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Perfil atualizado com sucesso!
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Informações do usuário */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Informações Pessoais
                </Typography>
                {!editMode ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                    size="small"
                  >
                    Editar
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => setEditMode(false)}
                      size="small"
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={formik.handleSubmit}
                      size="small"
                    >
                      Salvar
                    </Button>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    mr: 3,
                    fontSize: '2rem',
                  }}
                >
                  {profile?.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {profile?.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Membro desde {new Date(profile?.dataCadastro).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {editMode ? (
                <Box component="form" onSubmit={formik.handleSubmit}>
                  <TextField
                    fullWidth
                    margin="normal"
                    id="nomeCompleto"
                    name="nomeCompleto"
                    label="Nome Completo"
                    value={formik.values.nomeCompleto}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.nomeCompleto && Boolean(formik.errors.nomeCompleto)}
                    helperText={formik.touched.nomeCompleto && formik.errors.nomeCompleto}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Box>
              ) : (
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <FaceIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Nome Completo"
                      secondary={profile?.nomeCompleto || '-'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={profile?.email || '-'}
                    />
                  </ListItem>
                </List>
              )}
            </Paper>
          </Grid>

          {/* Estatísticas */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                Estatísticas
              </Typography>

              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={6} sm={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h3" align="center" fontWeight="bold" color="primary.main">
                        {profile?.partidasJogadas || 0}
                      </Typography>
                      <Typography variant="body2" align="center" color="text.secondary">
                        Partidas Jogadas
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h3" align="center" fontWeight="bold" color="success.main">
                        {profile?.partidasVencidas || 0}
                      </Typography>
                      <Typography variant="body2" align="center" color="text.secondary">
                        Vitórias
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h3" align="center" fontWeight="bold" color="secondary.main">
                        {getWinRate()}
                      </Typography>
                      <Typography variant="body2" align="center" color="text.secondary">
                        Taxa de Vitória
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h3" align="center" fontWeight="bold" color="info.main">
                        {profile?.pontuacao || 0}
                      </Typography>
                      <Typography variant="body2" align="center" color="text.secondary">
                        Pontuação Total
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Partidas Recentes
                </Typography>
                
                {getRecentGames().length > 0 ? (
                  <List>
                    {getRecentGames().map((game) => (
                      <ListItem 
                        key={game.id} 
                        button 
                        divider 
                        onClick={() => navigate(`/game/${game.id}`)}
                      >
                        <ListItemIcon>
                          <SportsEsportsIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Partida #${game.id}`}
                          secondary={`vs ${game.jogadorBrancas?.id === profile?.id 
                            ? game.jogadorPretas?.username || 'Aguardando oponente'
                            : game.jogadorBrancas?.username || 'Aguardando oponente'}`}
                        />
                        {game.vencedor?.id === profile?.id && (
                          <ListItemIcon>
                            <EmojiEventsIcon color="success" />
                          </ListItemIcon>
                        )}
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                    Você ainda não jogou nenhuma partida.
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProfilePage;