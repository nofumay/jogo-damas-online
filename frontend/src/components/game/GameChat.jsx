import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Paper,
  Typography,
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  InputAdornment,
  useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// Em uma implementação real, este componente se conectaria a um websocket para o chat

const GameChat = ({ gameId }) => {
  const theme = useTheme();
  const { currentGame } = useSelector((state) => state.game);
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Simulação de mensagens iniciais
  useEffect(() => {
    if (currentGame && currentGame.status !== 'AGUARDANDO') {
      setChatMessages([
        {
          id: 1,
          author: 'Sistema',
          content: 'Bem-vindos ao chat da partida!',
          timestamp: new Date(),
          isSystem: true
        }
      ]);
    }
  }, [currentGame]);

  // Rolar para a última mensagem sempre que novas mensagens chegarem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Em um sistema real, enviaríamos via websocket
    const newMessage = {
      id: Date.now(),
      author: user.username,
      content: message,
      timestamp: new Date(),
      isCurrentUser: true
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessage('');
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!currentGame) {
    return (
      <Paper sx={{ p: 2, height: '100%' }}>
        <Typography>Carregando chat...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ 
      p: 2, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column'
    }}>
      <Typography variant="h6" gutterBottom>
        Chat
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        mb: 2,
        minHeight: 200
      }}>
        {chatMessages.length === 0 ? (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <Typography variant="body2" color="text.secondary">
              {currentGame.status === 'AGUARDANDO' 
                ? 'O chat será disponibilizado quando a partida começar.' 
                : 'Sem mensagens ainda. Seja o primeiro a dizer olá!'}
            </Typography>
          </Box>
        ) : (
          <List>
            {chatMessages.map((msg) => (
              <ListItem 
                key={msg.id} 
                alignItems="flex-start"
                sx={{ 
                  py: 1,
                  px: 1,
                  borderRadius: 1,
                  bgcolor: msg.isSystem 
                    ? 'rgba(0, 0, 0, 0.05)'
                    : msg.isCurrentUser 
                      ? 'rgba(25, 118, 210, 0.08)'
                      : 'transparent',
                  alignSelf: msg.isCurrentUser ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}
              >
                {!msg.isSystem && (
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      mr: 1,
                      bgcolor: msg.isCurrentUser 
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main
                    }}
                  >
                    {msg.author.charAt(0).toUpperCase()}
                  </Avatar>
                )}
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle2"
                      color={msg.isSystem ? 'text.secondary' : 'text.primary'}
                      fontWeight={msg.isSystem ? 'medium' : 'bold'}
                    >
                      {msg.isSystem ? 'Sistema' : msg.author}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        component="span"
                      >
                        {msg.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        component="div"
                        align="right"
                      >
                        {formatTime(msg.timestamp)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Box>

      {currentGame.status === 'EM_ANDAMENTO' && (
        <Box component="form" onSubmit={handleSendMessage}>
          <TextField
            fullWidth
            size="small"
            placeholder="Digite uma mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!user || currentGame.status !== 'EM_ANDAMENTO'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    type="submit" 
                    color="primary" 
                    edge="end"
                    disabled={!message.trim() || !user || currentGame.status !== 'EM_ANDAMENTO'}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default GameChat;