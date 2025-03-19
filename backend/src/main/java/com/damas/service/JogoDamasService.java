package com.damas.service;

import com.damas.model.Partida;
import com.damas.model.Usuario;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class JogoDamasService {

    private static final int TAMANHO_TABULEIRO = 8;
    
    // 0 = vazio, 1 = peça branca, 2 = peça preta, 3 = dama branca, 4 = dama preta
    
    /**
     * Cria um novo tabuleiro com a configuração inicial do jogo de damas
     */
    public int[][] criarNovoTabuleiro() {
        int[][] tabuleiro = new int[TAMANHO_TABULEIRO][TAMANHO_TABULEIRO];
        
        // Inicializa o tabuleiro com peças nas posições corretas
        for (int linha = 0; linha < TAMANHO_TABULEIRO; linha++) {
            for (int coluna = 0; coluna < TAMANHO_TABULEIRO; coluna++) {
                // Só colocamos peças em casas pretas (soma de índices ímpar)
                if ((linha + coluna) % 2 == 1) {
                    if (linha < 3) {
                        // Peças pretas nas primeiras 3 linhas
                        tabuleiro[linha][coluna] = 2;
                    } else if (linha > 4) {
                        // Peças brancas nas últimas 3 linhas
                        tabuleiro[linha][coluna] = 1;
                    } else {
                        // Casas vazias no meio
                        tabuleiro[linha][coluna] = 0;
                    }
                } else {
                    // Casas brancas sempre vazias
                    tabuleiro[linha][coluna] = 0;
                }
            }
        }
        
        return tabuleiro;
    }
    
    /**
     * Converte o tabuleiro para formato JSON para armazenar no banco de dados
     */
    public String tabuleiroParaJson(int[][] tabuleiro) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(tabuleiro);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Erro ao converter tabuleiro para JSON", e);
        }
    }
    
    /**
     * Converte o JSON do banco de dados de volta para o formato do tabuleiro
     */
    public int[][] jsonParaTabuleiro(String json) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(json, int[][].class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Erro ao converter JSON para tabuleiro", e);
        }
    }
    
    /**
     * Verifica se um movimento é válido
     */
    public boolean isMovimentoValido(int[][] tabuleiro, int linhaOrigem, int colunaOrigem, 
                                    int linhaDestino, int colunaDestino, boolean jogadorBranco) {
        // Verificar se a posição de origem contém uma peça do jogador atual
        int peca = tabuleiro[linhaOrigem][colunaOrigem];
        
        // Verifica se a peça pertence ao jogador atual
        if (jogadorBranco && (peca != 1 && peca != 3)) {
            return false;
        }
        if (!jogadorBranco && (peca != 2 && peca != 4)) {
            return false;
        }
        
        // Verifica se o destino está vazio
        if (tabuleiro[linhaDestino][colunaDestino] != 0) {
            return false;
        }
        
        // Verificar se é um movimento diagonal
        int distanciaLinha = Math.abs(linhaDestino - linhaOrigem);
        int distanciaColuna = Math.abs(colunaDestino - colunaOrigem);
        
        if (distanciaLinha != distanciaColuna) {
            return false;
        }
        
        // Para peças normais (não damas)
        if (peca == 1 || peca == 2) {
            // Verifica a direção do movimento (peças só podem se mover para frente)
            if (peca == 1 && linhaDestino >= linhaOrigem) {
                return false; // Peças brancas só podem mover para cima
            }
            if (peca == 2 && linhaDestino <= linhaOrigem) {
                return false; // Peças pretas só podem mover para baixo
            }
            
            // Movimento simples (1 casa)
            if (distanciaLinha == 1) {
                return true;
            }
            
            // Movimento de captura (2 casas)
            if (distanciaLinha == 2) {
                // Calcula a posição da peça a ser capturada
                int linhaMeio = (linhaOrigem + linhaDestino) / 2;
                int colunaMeio = (colunaOrigem + colunaDestino) / 2;
                
                int pecaMeio = tabuleiro[linhaMeio][colunaMeio];
                
                // Verifica se há uma peça adversária no meio
                if (jogadorBranco && (pecaMeio == 2 || pecaMeio == 4)) {
                    return true; // Peça branca capturando peça preta
                }
                if (!jogadorBranco && (pecaMeio == 1 || pecaMeio == 3)) {
                    return true; // Peça preta capturando peça branca
                }
            }
        }
        
        // Para damas
        if (peca == 3 || peca == 4) {
            // Movimento simples (qualquer número de casas na diagonal)
            if (isCaminhoLivre(tabuleiro, linhaOrigem, colunaOrigem, linhaDestino, colunaDestino)) {
                return true;
            }
            
            // Movimento de captura
            List<int[]> pecasCapturadas = encontrarPecasCapturadas(tabuleiro, linhaOrigem, colunaOrigem, 
                                                                   linhaDestino, colunaDestino, jogadorBranco);
            return pecasCapturadas.size() == 1;
        }
        
        return false;
    }
    
    /**
     * Verifica se o caminho está livre para movimento de dama
     */
    private boolean isCaminhoLivre(int[][] tabuleiro, int linhaOrigem, int colunaOrigem, 
                                  int linhaDestino, int colunaDestino) {
        int incrementoLinha = Integer.compare(linhaDestino, linhaOrigem);
        int incrementoColuna = Integer.compare(colunaDestino, colunaOrigem);
        
        int linha = linhaOrigem + incrementoLinha;
        int coluna = colunaOrigem + incrementoColuna;
        
        while (linha != linhaDestino && coluna != colunaDestino) {
            if (tabuleiro[linha][coluna] != 0) {
                return false;
            }
            linha += incrementoLinha;
            coluna += incrementoColuna;
        }
        
        return true;
    }
    
    /**
     * Encontra peças adversárias que seriam capturadas em um movimento
     */
    private List<int[]> encontrarPecasCapturadas(int[][] tabuleiro, int linhaOrigem, int colunaOrigem,
                                                int linhaDestino, int colunaDestino, boolean jogadorBranco) {
        List<int[]> pecasCapturadas = new ArrayList<>();
        
        int incrementoLinha = Integer.compare(linhaDestino, linhaOrigem);
        int incrementoColuna = Integer.compare(colunaDestino, colunaOrigem);
        
        int linha = linhaOrigem + incrementoLinha;
        int coluna = colunaOrigem + incrementoColuna;
        
        while (linha != linhaDestino && coluna != colunaDestino) {
            int peca = tabuleiro[linha][coluna];
            
            if (peca != 0) {
                boolean pecaAdversaria = (jogadorBranco && (peca == 2 || peca == 4)) || 
                                         (!jogadorBranco && (peca == 1 || peca == 3));
                
                if (pecaAdversaria) {
                    pecasCapturadas.add(new int[]{linha, coluna});
                } else {
                    // Peça própria no caminho, captura inválida
                    return Collections.emptyList();
                }
            }
            
            linha += incrementoLinha;
            coluna += incrementoColuna;
        }
        
        return pecasCapturadas;
    }
    
    /**
     * Executa um movimento no tabuleiro
     */
    public int[][] executarMovimento(int[][] tabuleiro, int linhaOrigem, int colunaOrigem, 
                                   int linhaDestino, int colunaDestino, boolean jogadorBranco) {
        // Copia o tabuleiro para não modificar o original
        int[][] novoTabuleiro = new int[TAMANHO_TABULEIRO][TAMANHO_TABULEIRO];
        for (int i = 0; i < TAMANHO_TABULEIRO; i++) {
            System.arraycopy(tabuleiro[i], 0, novoTabuleiro[i], 0, TAMANHO_TABULEIRO);
        }
        
        // Obtém a peça a ser movida
        int peca = novoTabuleiro[linhaOrigem][colunaOrigem];
        
        // Move a peça
        novoTabuleiro[linhaDestino][colunaDestino] = peca;
        novoTabuleiro[linhaOrigem][colunaOrigem] = 0;
        
        // Captura peças adversárias (se houver)
        if (peca == 1 || peca == 2) {
            // Para peças normais
            if (Math.abs(linhaDestino - linhaOrigem) == 2) {
                int linhaMeio = (linhaOrigem + linhaDestino) / 2;
                int colunaMeio = (colunaOrigem + colunaDestino) / 2;
                novoTabuleiro[linhaMeio][colunaMeio] = 0; // Remove a peça capturada
            }
        } else {
            // Para damas
            List<int[]> pecasCapturadas = encontrarPecasCapturadas(tabuleiro, linhaOrigem, colunaOrigem, 
                                                                 linhaDestino, colunaDestino, jogadorBranco);
            for (int[] posicao : pecasCapturadas) {
                novoTabuleiro[posicao[0]][posicao[1]] = 0; // Remove a peça capturada
            }
        }
        
        // Verifica promoção para dama (quando uma peça chega ao lado oposto do tabuleiro)
        if (peca == 1 && linhaDestino == 0) {
            novoTabuleiro[linhaDestino][colunaDestino] = 3; // Promove peça branca para dama
        } else if (peca == 2 && linhaDestino == TAMANHO_TABULEIRO - 1) {
            novoTabuleiro[linhaDestino][colunaDestino] = 4; // Promove peça preta para dama
        }
        
        return novoTabuleiro;
    }
    
    /**
     * Verifica se o jogo acabou (um jogador não tem mais peças ou não pode mais se mover)
     */
    public boolean isJogoAcabou(int[][] tabuleiro) {
        boolean temPecasBrancas = false;
        boolean temPecasPretas = false;
        
        // Verifica se ambos os jogadores têm peças
        for (int linha = 0; linha < TAMANHO_TABULEIRO; linha++) {
            for (int coluna = 0; coluna < TAMANHO_TABULEIRO; coluna++) {
                int peca = tabuleiro[linha][coluna];
                if (peca == 1 || peca == 3) {
                    temPecasBrancas = true;
                } else if (peca == 2 || peca == 4) {
                    temPecasPretas = true;
                }
                
                if (temPecasBrancas && temPecasPretas) {
                    return false; // O jogo continua se ambos têm peças
                }
            }
        }
        
        return true; // O jogo acabou se um dos jogadores não tem mais peças
    }
    
    /**
     * Determina o vencedor quando o jogo acabou
     */
    public Usuario determinarVencedor(int[][] tabuleiro, Usuario jogadorBrancas, Usuario jogadorPretas) {
        boolean temPecasBrancas = false;
        boolean temPecasPretas = false;
        
        for (int linha = 0; linha < TAMANHO_TABULEIRO; linha++) {
            for (int coluna = 0; coluna < TAMANHO_TABULEIRO; coluna++) {
                int peca = tabuleiro[linha][coluna];
                if (peca == 1 || peca == 3) {
                    temPecasBrancas = true;
                } else if (peca == 2 || peca == 4) {
                    temPecasPretas = true;
                }
            }
        }
        
        if (temPecasBrancas && !temPecasPretas) {
            return jogadorBrancas;
        } else if (!temPecasBrancas && temPecasPretas) {
            return jogadorPretas;
        }
        
        return null; // Empate ou jogo ainda não acabou
    }
    
    /**
     * Gera um código único para uma partida
     */
    public String gerarCodigoPartida() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}