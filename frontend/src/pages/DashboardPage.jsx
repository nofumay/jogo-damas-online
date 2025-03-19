import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Grid, 
  TextField,
  CircularProgress,
  Tab,
  Tabs,
  Divider,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HistoryIcon from '@mui/icons-material/History';
import RefreshIcon from '@mui/icons-material/Refresh';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';

import { 
  fetchMyGames, 
  fetchAvailableGames, 
  createGame, 
  joinGame 
} from '../redux/slices/gameSlice';
import { fetchUserProfile } from '../redux/slices/userSlice';

// Componente de TabPanel para as tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`game-tabpanel-${index}`}
      aria-labelledby={`game-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myGames, availableGames, isLoading } = useSelector((state) => state.game);
  const { profile } = useSelector((state) => state.user);
  
  const [tabIndex, setTabIndex] = useState(0);
  const [openNewGameDialog, setOpenNewGameDialog] = useState(false);
  const [joinGameCode, setJoinGameCode] = useState('');
  const [openJoinGameDialog, setOpenJoinGameDialog] = useState(false);
  const [error, setError] = useState(null);
  
  // Buscar dados no carregamento inicial
  useEffect(() => {
    dispatch(fetchMyGames());
    dispatch(fetchAvailableGames());
    dispatch(fetchUserProfile());
  }, [dispatch]);
  
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  
  const handleRefresh = () => {
    dispatch(fetchMyGames());
    dispatch(fetchAvailableGames());
  };
  
  const handleOpenNewGameDialog = () => {
    setOpenNewGameDialog(true);
  };
  
  const handleCloseNewGameDialog = () => {
    setOpenNewGameDialog(false);
  };
  
  const handleCreateGame = () => {
    dispatch(createGame({ partidaPrivada: false }))
      .unwrap()
      .then((game) => {
        handleCloseNewGameDialog();
        navigate(`/game/${game.id}`);
      })
      .catch((err) => {
        console.error('Erro ao criar partida:', err);
      });
  };
  
  const handleOpenJoinGameDialog = () => {
    setJoinGameCode('');
    setError(null);
    setOpenJoinGameDialog(true);
  };
  
  const handleCloseJoinGameDialog = () => {
    setOpenJoinGameDialog(false);
  };
  
  const handleJoinGame = (gameId) => {
    dispatch(joinGame(gameId))
      .unwrap()
      .then((game) => {
        navigate(`/game/${game.id}`);
      })
      .catch((err) => {
        console.error('Erro ao entrar na partida:', err);
      });
  };
  
  const handleJoinGameByCode = () => {
    if (!joinGameCode) {
      setError('Digite um código de partida válido');
      return;
    }
    
    // Normalmente, teríamos um endpoint para buscar partida por código
    // Por simplicidade, vamos apenas navegar para a URL
    handleCloseJoinGameDialog();
    navigate(`/join/${joinGameCode}`);
  };
  
  // Status das partidas em português
  const gameStatusMap = {
    'AGUARDANDO': 'Aguardando oponente',
    'EM_ANDAMENTO': 'Em andamento',
    'FINALIZADA': 'Finalizada',
    'ABANDONADA': 'Abandonada'
  };
  
  // Cor para o chip de status
  const statusColor = {
    'AGUARDANDO': 'warning',
    'EM_ANDAMENTO': 'success',
    'FINALIZADA': 'info',
    'ABANDONADA': 'error'
  };
  
  // Renderiza uma lista de partidas
  const renderGameList = (games, emptyMessage) => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (!games || games.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="body1" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      );
    }
    
    return (
      <Grid container spacing={3}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} md={4} key={game.id}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div" fontWeight="medium">
                    Partida #{game.id}
                  </Typography>
                  <Chip 
                    label={gameStatusMap[game.status] || game.status} 
                    color={statusColor[game.status] || 'default'}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Brancas:</strong> {game.jogadorBrancas?.username || 'Aguardando...'}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Pretas:</strong> {game.jogadorPretas?.username || 'Aguardando...'}
                </Typography>
                
                {game.status === 'FINALIZADA' && game.vencedor && (
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    <strong>Vencedor:</strong> {game.vencedor.username}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => navigate(`/game/${game.id}`)}
                  startIcon={<PlayArrowIcon />}
                  fullWidth
                >
                  {game.status === 'AGUARDANDO' && !game.jogadorPretas ? 'Continuar' :
                   game.status === 'EM_ANDAMENTO' ? 'Jogar' : 'Ver Partida'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Cabeçalho do Dashboard */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Painel do Jogador
              </Typography>
              {profile && (
                <Typography variant="subtitle1" color="text.secondary">
                  Bem-vindo(a), {profile.nomeCompleto || profile.username}!
                </Typography>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
              <Button 
                variant="outlined" 
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
              >
                Atualizar
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenNewGameDialog}
              >
                Nova Partida
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<SportsCricketIcon />}
                onClick={handleOpenJoinGameDialog}
              >
                Entrar com Código
              </Button>
            </Box>
          </Box>
          
          {profile && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Partidas jogadas:
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {profile.partidasJogadas || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Vitórias:
                  </Typography>
                  <Typography variant="h6" fontWeight="medium" color="success.main">
                    {profile.partidasVencidas || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Pontuação:
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {profile.pontuacao || 0}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
        
        {/* Tabs para as partidas */}
        <Paper elevation={1}>
          <Tabs 
            value={tabIndex} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              icon={<PlayArrowIcon />} 
              label="Minhas Partidas" 
              id="game-tab-0" 
              aria-controls="game-tabpanel-0" 
            />
            <Tab 
              icon={<HistoryIcon />} 
              label="Partidas Disponíveis" 
              id="game-tab-1" 
              aria-controls="game-tabpanel-1"
            />
          </Tabs>
          
          <TabPanel value={tabIndex} index={0}>
            <Typography variant="h6" component="h2" gutterBottom>
              Minhas Partidas
            </Typography>
            {renderGameList(myGames, 'Você ainda não tem partidas. Crie uma nova partida ou entre em uma partida existente.')}
          </TabPanel>
          
          <TabPanel value={tabIndex} index={1}>
            <Typography variant="h6" component="h2" gutterBottom>
              Partidas Disponíveis
            </Typography>
            {renderGameList(availableGames, 'Não há partidas disponíveis no momento. Crie uma nova partida!')}
          </TabPanel>
        </Paper>
      </Box>
      
      {/* Diálogo para criar nova partida */}
      <Dialog open={openNewGameDialog} onClose={handleCloseNewGameDialog}>
        <DialogTitle>Criar Nova Partida</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você deseja criar uma nova partida de damas? Outros jogadores poderão se juntar à sua partida.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewGameDialog}>Cancelar</Button>
          <Button 
            onClick={handleCreateGame} 
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Criar Partida'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para entrar em uma partida por código */}
      <Dialog open={openJoinGameDialog} onClose={handleCloseJoinGameDialog}>
        <DialogTitle>Entrar em uma Partida</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Digite o código da partida fornecido pelo outro jogador.
          </DialogContentText>
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="gameCode"
            label="Código da Partida"
            type="text"
            fullWidth
            variant="outlined"
            value={joinGameCode}
            onChange={(e) => setJoinGameCode(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJoinGameDialog}>Cancelar</Button>
          <Button 
            onClick={handleJoinGameByCode} 
            variant="contained"
            color="primary"
            disabled={isLoading || !joinGameCode}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DashboardPage;