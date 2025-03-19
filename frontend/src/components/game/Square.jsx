import React from 'react';
import { useTheme } from '@mui/material/styles';

const Square = ({ row, col, piece, isWhite, highlight, onClick }) => {
  const theme = useTheme();
  
  // Determina a cor de fundo da casa
  const backgroundColor = isWhite ? theme.palette.background.default : theme.palette.primary.main;
  
  // Determina se tem peça e qual tipo
  const hasPiece = piece !== 0;
  const pieceColor = piece === 1 || piece === 3 ? 'white' : 'black'; // 1,3 = branca, 2,4 = preta
  const isKing = piece === 3 || piece === 4; // 3,4 = damas
  
  // Classes adicionais baseadas no destaque
  let highlightClass = '';
  if (highlight === 'selected') {
    highlightClass = 'selected';
  } else if (highlight === 'possible-move') {
    highlightClass = 'possible-move';
  }
  
  return (
    <div 
      className={`square ${isWhite ? 'white' : 'black'} ${highlightClass}`}
      onClick={onClick}
      style={{ backgroundColor }}
    >
      {hasPiece && (
        <div 
          className={`piece ${pieceColor} ${isKing ? 'king' : ''}`}
          data-row={row}
          data-col={col}
        />
      )}
    </div>
  );
};

export default Square;