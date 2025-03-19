import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { updateGameState } from '../redux/slices/gameSlice';

let stompClient = null;
let gameSubscription = null;

const websocketService = {
  // Conecta ao websocket
  connect: (gameId, dispatch) => {
    const wsUrl = process.env.NODE_ENV === 'production'
      ? 'https://api.jogo-damas-online.herokuapp.com/ws'
      : 'http://localhost:8080/ws';
    
    const socket = new SockJS(wsUrl);
    stompClient = Stomp.over(socket);
    
    stompClient.connect(
      {},
      () => {
        console.log('WebSocket conectado');
        
        // Inscreve-se no tópico da partida específica
        if (gameId) {
          websocketService.subscribeToGame(gameId, dispatch);
        }
      },
      (error) => {
        console.error('Erro na conexão WebSocket:', error);
        setTimeout(() => {
          websocketService.connect(gameId, dispatch);
        }, 5000); // Tenta reconectar após 5 segundos
      }
    );
    
    return stompClient;
  },
  
  // Desconecta do websocket
  disconnect: () => {
    if (stompClient !== null) {
      if (gameSubscription) {
        gameSubscription.unsubscribe();
      }
      stompClient.disconnect();
      console.log('WebSocket desconectado');
    }
  },
  
  // Inscreve-se para receber atualizações de uma partida específica
  subscribeToGame: (gameId, dispatch) => {
    if (stompClient !== null && stompClient.connected) {
      // Cancela inscrição anterior, se houver
      if (gameSubscription) {
        gameSubscription.unsubscribe();
      }
      
      // Inscreve-se no tópico da partida
      gameSubscription = stompClient.subscribe(
        `/topic/partida/${gameId}`,
        (message) => {
          const gameState = JSON.parse(message.body);
          dispatch(updateGameState(gameState));
        }
      );
      
      console.log(`Inscrito no tópico da partida ${gameId}`);
    }
  },
  
  // Envia uma notificação de movimento realizado
  sendMoveNotification: (gameId, move) => {
    if (stompClient !== null && stompClient.connected) {
      stompClient.send(
        '/app/partida.movimento',
        {},
        JSON.stringify({
          partidaId: gameId,
          ...move
        })
      );
    }
  },
};

export default websocketService;