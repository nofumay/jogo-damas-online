import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Grid, 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Board from '../components/game/Board';
import GameInfo from '../components/game/GameInfo';
import MoveHistory from '../components/game/MoveHistory';
import GameChat from '../components/game/GameChat';
import { fetchGameById, resetGame } from '../redux/slices/gameSlice';
import websocketService from '../services/websocketService';

const GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentGame, isLoading, error } = useSelector((state) => state.game);
  const { user } = useSelector((state) => state.auth);
  
  // Buscar informações da partida
  useEffect(() => {
    if (gameId) {
      dispatch(fetchGameById(gameId));
    }
    
    return () => {
      dispatch(resetGame());
    };
  }, [gameId, dispatch]);
  
  // Conectar ao WebSocket
  useEffect(() => {
    if (gameId) {
      websocketService.connect(gameId, dispatch);
      
      return () => {
        websocketService.disconnect();
      };
    }
  }, [gameId, dispatch]);
  
  // Verifica se o jogador atual é um dos jogadores da partida
  const isPlayerInGame = currentGame && user && (
    user.id === currentGame?.jogadorBrancas?.id || 
    user.id === currentGame?.jogadorPretas?.id
  );
  
  // Verifica se é a vez do jogador atual
  const isPlayerTurn = currentGame && isPlayerInGame && (
    (user.id === currentGame.jogadorBrancas?.id && currentGame.jogadorAtualBrancas) ||
    (user.id === currentGame.jogadorPretas?.id && !currentGame.jogadorAtualBrancas)
  );
  
  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '70vh' 
        }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 5 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="error" gutterBottom>
              Erro ao carregar a partida
            </Typography>
            <Typography paragraph>
              {error}
            </Typography>
            <Button 
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ mt: 2 }}
            >
              Voltar ao painel
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }
  
  if (!currentGame) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 5 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Partida não encontrada
            </Typography>
            <Button 
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ mt: 2 }}
            >
              Voltar ao painel
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="xl">
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
          Partida #{gameId}
        </Typography>
        
        <Grid container spacing={3}>
          {/* Tabuleiro de Damas */}
          <Grid item xs={12} md={8}>
            <Board 
              gameId={gameId} 
              isPlayerTurn={isPlayerTurn} 
              isSpectator={!isPlayerInGame}
            />
          </Grid>
          
          {/* Informações da Partida */}
          <Grid item xs={12} md={4}>
            <GameInfo gameId={gameId} />
          </Grid>
          
          {/* Histórico de Movimentos */}
          <Grid item xs={12} md={4}>
            <MoveHistory />
          </Grid>
          
          {/* Chat */}
          <Grid item xs={12} md={8}>
            <GameChat gameId={gameId} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default GamePage;