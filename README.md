# Jogo de Damas Online

Um jogo de damas online profissional desenvolvido com React (frontend) e Java Spring Boot (backend).

## Características

- Jogo de damas completo com todas as regras oficiais
- Jogo exclusivamente online (multijogador)
- Sistema de cadastro e autenticação de usuários
- Interface moderna e responsiva
- Ranking de jogadores
- Chat entre jogadores

## Tecnologias Utilizadas

### Frontend
- React
- Redux para gerenciamento de estado
- Styled-components para estilização
- Socket.io client para comunicação em tempo real

### Backend
- Java Spring Boot
- Spring Security para autenticação
- WebSockets para comunicação em tempo real
- JPA/Hibernate para persistência de dados
- PostgreSQL para banco de dados

## Como executar localmente

### Backend
```
cd backend
./mvnw spring-boot:run
```

### Frontend
```
cd frontend
npm install
npm start
```

## Deploy

- Frontend: Netlify
- Backend: Heroku ou similar

## Licença

MIT