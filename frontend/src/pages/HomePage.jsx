import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  CardMedia,
  useTheme
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

// Imagens 
const boardImagePlaceholder = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22225%22%20viewBox%3D%220%200%20800%20225%22%3E%3Crect%20fill%3D%22%235D4037%22%20width%3D%22800%22%20height%3D%22225%22%2F%3E%3Ctext%20fill%3D%22%23FFFFFF%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2240%22%20x%3D%22250%22%20y%3D%22120%22%3ETABULEIRO%20DE%20DAMAS%3C%2Ftext%3E%3C%2Fsvg%3E';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Box sx={{ py: 5 }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          py: 8,
          mb: 6,
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
                Jogo de Damas Online
              </Typography>
              <Typography variant="h5" paragraph>
                Jogue com amigos em tempo real, em qualquer lugar!
              </Typography>
              <Box sx={{ mt: 4 }}>
                {isAuthenticated ? (
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="large" 
                    startIcon={<PlayArrowIcon />}
                    onClick={() => navigate('/dashboard')}
                    sx={{ 
                      mr: 2, 
                      px: 4, 
                      py: 1.5,
                      fontSize: '1.1rem'
                    }}
                  >
                    Jogar Agora
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{ 
                        mr: 2, 
                        px: 4, 
                        py: 1.5,
                        fontSize: '1.1rem'
                      }}
                    >
                      Registrar
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="inherit"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{ 
                        px: 4, 
                        py: 1.5,
                        fontSize: '1.1rem'
                      }}
                    >
                      Entrar
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={boardImagePlaceholder}
                alt="Tabuleiro de Damas"
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" align="center" fontWeight="bold" gutterBottom>
          Características
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Descubra o que torna nosso jogo de damas especial
        </Typography>

        <Grid container spacing={4} sx={{ mt: 3 }}>
          {/* Feature 1 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
              <CardMedia
                component="div"
                sx={{
                  pt: '56.25%',
                  bgcolor: 'primary.light',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <SportsEsportsIcon sx={{ fontSize: 80, color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                  Jogo Online em Tempo Real
                </Typography>
                <Typography>
                  Conecte-se com jogadores de todo o mundo e desafie-os para uma partida de damas em tempo real.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Feature 2 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
              <CardMedia
                component="div"
                sx={{
                  pt: '56.25%',
                  bgcolor: 'secondary.main',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <PersonIcon sx={{ fontSize: 80, color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                  Sistema de Perfil Completo
                </Typography>
                <Typography>
                  Acompanhe suas estatísticas, vitórias e progresso através do seu perfil personalizado.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Feature 3 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
              <CardMedia
                component="div"
                sx={{
                  pt: '56.25%',
                  bgcolor: 'primary.dark',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <EmojiEventsIcon sx={{ fontSize: 80, color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                  Ranking e Competições
                </Typography>
                <Typography>
                  Participe de nossa tabela de classificação e suba no ranking para mostrar suas habilidades.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* CTA Section */}
        <Box sx={{ bgcolor: 'background.paper', p: 6, borderRadius: 2, mt: 8, textAlign: 'center', boxShadow: 1 }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            Pronto para jogar?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Junte-se à nossa comunidade de jogadores e comece a se divertir agora mesmo!
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            sx={{ 
              mt: 2,
              px: 5,
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            {isAuthenticated ? 'Jogar Agora' : 'Começar'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;