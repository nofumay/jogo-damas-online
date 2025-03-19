import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { selectPiece, clearSelection, makeMove } from '../../redux/slices/gameSlice';
import Square from './Square';

const Board = ({ gameId, isPlayerTurn, isSpectator = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { currentGame, selectedPiece, possibleMoves } = useSelector((state) => state.game);
  const { user } = useSelector((state) => state.auth);

  if (!currentGame || !currentGame.tabuleiro) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Carregando tabuleiro...</Typography>
      </Paper>
    );
  }

  const board = currentGame.tabuleiro;
  
  // Determina se o jogador atual é o jogador de peças brancas
  const isWhitePlayer = user?.id === currentGame.jogadorBrancas?.id;
  const isBlackPlayer = user?.id === currentGame.jogadorPretas?.id;
  
  const isCurrentPlayerWhite = currentGame.jogadorAtualBrancas;
  
  // Verifica se é a vez do jogador
  const canMove = isPlayerTurn && 
                 ((isWhitePlayer && isCurrentPlayerWhite) || 
                  (isBlackPlayer && !isCurrentPlayerWhite));

  const handleSquareClick = (row, col) => {
    if (isSpectator || !canMove) return; // Se for espectador ou não for sua vez, não faz nada
    
    const piece = board[row][col];
    
    // Se não tem peça selecionada e clicou em uma peça válida
    if (!selectedPiece && piece !== 0) {
      // Verifica se a peça pertence ao jogador atual
      const isWhitePiece = piece === 1 || piece === 3; // 1 = peça branca, 3 = dama branca
      
      if ((isWhitePlayer && isWhitePiece) || (isBlackPlayer && !isWhitePiece)) {
        dispatch(selectPiece({ row, col }));
      }
    } 
    // Se já tem uma peça selecionada
    else if (selectedPiece) {
      // Se clicou na mesma peça, desseleciona
      if (selectedPiece.row === row && selectedPiece.col === col) {
        dispatch(clearSelection());
      } 
      // Se clicou em uma casa vazia (possível movimento)
      else if (board[row][col] === 0) {
        // Aqui deveria verificar se o movimento é válido com base nas regras do jogo
        // Por simplicidade, vamos apenas verificar se é uma diagonal
        const rowDiff = Math.abs(row - selectedPiece.row);
        const colDiff = Math.abs(col - selectedPiece.col);
        
        if (rowDiff === colDiff) {
          const move = {
            linhaOrigem: selectedPiece.row,
            colunaOrigem: selectedPiece.col,
            linhaDestino: row,
            colunaDestino: col
          };
          
          dispatch(makeMove({ gameId, move }));
          dispatch(clearSelection());
        }
      } 
      // Se clicou em outra peça do mesmo jogador, seleciona ela
      else {
        const isWhitePiece = piece === 1 || piece === 3;
        
        if ((isWhitePlayer && isWhitePiece) || (isBlackPlayer && !isWhitePiece)) {
          dispatch(selectPiece({ row, col }));
        }
      }
    }
  };

  // Determina se uma casa deve ser destacada (selecionada ou possível movimento)
  const isHighlighted = (row, col) => {
    if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
      return 'selected';
    }
    
    if (possibleMoves.some(move => move.row === row && move.col === col)) {
      return 'possible-move';
    }
    
    return null;
  };

  // Inverte o tabuleiro para o jogador de peças pretas
  const renderBoard = () => {
    const rows = [];
    
    for (let i = 0; i < 8; i++) {
      const squares = [];
      for (let j = 0; j < 8; j++) {
        // Determina os índices corretos baseados na perspectiva do jogador
        const rowIndex = isBlackPlayer ? 7 - i : i;
        const colIndex = isBlackPlayer ? 7 - j : j;
        
        squares.push(
          <Square
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            piece={board[rowIndex][colIndex]}
            isWhite={(rowIndex + colIndex) % 2 === 0}
            highlight={isHighlighted(rowIndex, colIndex)}
            onClick={() => handleSquareClick(rowIndex, colIndex)}
          />
        );
      }
      rows.push(<div key={i} style={{ display: 'flex' }}>{squares}</div>);
    }
    
    return rows;
  };

  return (
    <Box className="board-container">
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 2, 
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <div className="board">
          {renderBoard()}
        </div>
      </Paper>
    </Box>
  );
};

export default Board;