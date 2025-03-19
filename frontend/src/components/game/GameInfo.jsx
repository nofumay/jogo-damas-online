import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Paper, 
  Typography, 
  Box, 
  Divider, 
  Button, 
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  useTheme
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import FlagIcon from '@mui/icons-material/Flag';

import { resignGame } from '../../redux/slices/gameSlice';

const GameInfo = ({ gameId }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { currentGame } = useSelector((state) => state.game);
  const { user } = useSelector((state) => state.auth);
  
  const [whiteTime, setWhiteTime] = useState(0);
  const [blackTime, setBlackTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  
  // Converter segundos para formato MM:SS
  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Inicializar temporizadores quando o jogo carrega
  useEffect(() => {
    if (currentGame) {
      setWhiteTime(currentGame.tempoJogadorBrancas || 0);
      setBlackTime(currentGame.tempoJogadorPretas || 0);
    }
  }, [currentGame]);
  
  // Gerenciar o temporizador quando o turno muda
  useEffect(() => {
    if (currentGame && currentGame.status === 'EM_ANDAMENTO') {
      // Limpar intervalo anterior
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      // Iniciar novo intervalo apenas se houver um limite de tempo definido
      if (currentGame.tempoJogadorBrancas !== null && currentGame.tempoJogadorPretas !== null) {
        const interval = setInterval(() => {
          if (currentGame.jogadorAtualBrancas) {
            setWhiteTime(prev => (prev > 0 ? prev - 1 : 0));
          } else {
            setBlackTime(prev => (prev > 0 ? prev - 1 : 0));
          }
        }, 1000);
        
        setTimerInterval(interval);
      }
    }
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [currentGame?.jogadorAtualBrancas, currentGame?.status]);
  
  // Limpar o temporizador quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);
  
  const handleResign = () => {
    if (window.confirm('Tem certeza que deseja desistir desta partida?')) {
      dispatch(resignGame(gameId));
    }
  };
  
  if (!currentGame) {
    return (
      <Paper sx={{ p: 2, height: '100%' }}>
        <Typography>Carregando informações da partida...</Typography>
      </Paper>
    );
  }
  
  const isPlayerInGame = user && (
    user.id === currentGame.jogadorBrancas?.id || 
    user.id === currentGame.jogadorPretas?.id
  );
  
  const isGameActive = currentGame.status === 'EM_ANDAMENTO';
  
  // Determina se é a vez do jogador atual
  const isWhitePlayer = user?.id === currentGame.jogadorBrancas?.id;
  const isBlackPlayer = user?.id === currentGame.jogadorPretas?.id;
  const isMyTurn = isGameActive && (
    (isWhitePlayer && currentGame.jogadorAtualBrancas) ||
    (isBlackPlayer && !currentGame.jogadorAtualBrancas)
  );
  
  // Status do jogo em português
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
  
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Partida de Damas
      </Typography>
      
      <Chip 
        label={gameStatusMap[currentGame.status] || currentGame.status} 
        color={statusColor[currentGame.status] || 'default'}
        sx={{ mb: 2 }}
      />
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Jogadores
        </Typography>
        
        <List sx={{ width: '100%' }}>
          {/* Jogador Brancas */}
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: theme.palette.grey[300], color: theme.palette.text.primary }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary={currentGame.jogadorBrancas?.username || "Aguardando..."} 
              secondary={`Peças brancas ${whiteTime !== null ? `• ${formatTime(whiteTime)}` : ''}`}
            />
            {currentGame.jogadorAtualBrancas && isGameActive && (
              <Chip size="small" color="primary" label="Jogando" sx={{ ml: 1 }} />
            )}
          </ListItem>
          
          {/* Jogador Pretas */}
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: theme.palette.grey[900], color: theme.palette.common.white }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary={currentGame.jogadorPretas?.username || "Aguardando..."} 
              secondary={`Peças pretas ${blackTime !== null ? `• ${formatTime(blackTime)}` : ''}`}
            />
            {!currentGame.jogadorAtualBrancas && isGameActive && (
              <Chip size="small" color="primary" label="Jogando" sx={{ ml: 1 }} />
            )}
          </ListItem>
        </List>
      </Box>
      
      {currentGame.status === 'FINALIZADA' && currentGame.vencedor && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold" color="success.main">
            Vencedor: {currentGame.vencedor.username}
          </Typography>
        </Box>
      )}
      
      {isGameActive && isPlayerInGame && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="body1" fontWeight="bold" color={isMyTurn ? 'success.main' : 'text.secondary'}>
            {isMyTurn ? 'Sua vez de jogar!' : 'Aguardando oponente...'}
          </Typography>
        </Box>
      )}
      
      {isGameActive && isPlayerInGame && (
        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<FlagIcon />}
          fullWidth
          onClick={handleResign}
        >
          Desistir
        </Button>
      )}
      
      {currentGame.status === 'AGUARDANDO' && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Código da partida: <strong>{currentGame.codigoPartida}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Compartilhe este código com um amigo para ele entrar na partida.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default GameInfo;