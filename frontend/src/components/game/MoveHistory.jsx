import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Paper, 
  Typography, 
  Box, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  useTheme
} from '@mui/material';

const MoveHistory = () => {
  const theme = useTheme();
  const { currentGame } = useSelector((state) => state.game);
  
  if (!currentGame) {
    return (
      <Paper sx={{ p: 2, height: '100%' }}>
        <Typography>Carregando histórico...</Typography>
      </Paper>
    );
  }
  
  // Função para converter coordenadas do movimento em notação legível
  const formatMove = (moveString) => {
    if (!moveString) return [];
    
    const moves = moveString.split(';').filter(m => m.trim());
    
    return moves.map((move, index) => {
      if (!move) return null;
      
      try {
        const [from, to] = move.split(':');
        const [fromRow, fromCol] = from.split(',');
        const [toRow, toCol] = to.split(',');
        
        // Converter coordenadas numéricas para notação de xadrez (colunas: a-h, linhas: 8-1)
        const colsMap = {0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h'};
        const fromNotation = `${colsMap[fromCol] || fromCol}${8 - fromRow}`;
        const toNotation = `${colsMap[toCol] || toCol}${8 - toRow}`;
        
        return {
          id: index,
          number: Math.floor(index / 2) + 1,
          player: index % 2 === 0 ? 'Brancas' : 'Pretas',
          from: fromNotation,
          to: toNotation,
          notation: `${fromNotation}-${toNotation}`
        };
      } catch (error) {
        console.error('Erro ao processar movimento:', move, error);
        return {
          id: index,
          number: Math.floor(index / 2) + 1,
          player: index % 2 === 0 ? 'Brancas' : 'Pretas',
          notation: move
        };
      }
    }).filter(Boolean);
  };
  
  const moveHistory = formatMove(currentGame.movimentoHistorico);
  
  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Histórico de Movimentos
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      {moveHistory.length === 0 ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Ainda não foram realizados movimentos.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <List dense>
            {moveHistory.map((move) => (
              <ListItem key={move.id} sx={{ py: 0.5 }}>
                <ListItemText 
                  primary={
                    <Typography variant="body2">
                      <Box component="span" fontWeight="bold" mr={1}>
                        {move.number}.
                      </Box>
                      <Box 
                        component="span" 
                        color={move.player === 'Brancas' ? 'text.primary' : 'text.primary'}
                        bgcolor={move.player === 'Brancas' ? 'grey.200' : 'grey.800'}
                        px={1}
                        py={0.5}
                        borderRadius={1}
                        mr={1}
                        fontWeight="medium"
                        fontSize="0.75rem"
                      >
                        {move.player}
                      </Box>
                      {move.notation}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};

export default MoveHistory;