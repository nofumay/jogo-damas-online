package com.damas.service;

import com.damas.dto.*;
import com.damas.model.Partida;
import com.damas.model.Usuario;
import com.damas.repository.PartidaRepository;
import com.damas.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PartidaService {

    private final PartidaRepository partidaRepository;
    private final UsuarioRepository usuarioRepository;
    private final JogoDamasService jogoDamasService;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public PartidaDTO criarPartida(NovaPartidaRequest request, String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Cria uma nova partida
        Partida partida = new Partida();
        partida.setJogadorBrancas(usuario);
        partida.setStatus(Partida.StatusPartida.AGUARDANDO);
        partida.setDataInicio(LocalDateTime.now());
        
        // Gera o tabuleiro inicial
        int[][] tabuleiro = jogoDamasService.criarNovoTabuleiro();
        partida.setEstadoTabuleiro(jogoDamasService.tabuleiroParaJson(tabuleiro));
        
        // Define o tempo da partida, se fornecido
        if (request.getTempoPartida() != null) {
            partida.setTempoJogadorBrancas(request.getTempoPartida());
            partida.setTempoJogadorPretas(request.getTempoPartida());
        }
        
        // Gera código único para a partida
        partida.setCodigoPartida(jogoDamasService.gerarCodigoPartida());
        
        // Salva a partida
        partida = partidaRepository.save(partida);
        
        return converterParaDTO(partida);
    }

    @Transactional(readOnly = true)
    public List<PartidaDTO> listarPartidasDoUsuario(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        return partidaRepository.findByJogadorBrancasOrJogadorPretas(usuario, usuario)
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PartidaDTO> listarPartidasAguardando() {
        return partidaRepository.findPartidasAguardando()
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PartidaDTO obterPartida(Long id) {
        Partida partida = partidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada"));
        
        return converterParaDTO(partida);
    }

    @Transactional(readOnly = true)
    public PartidaDTO obterPartidaPorCodigo(String codigoPartida) {
        Partida partida = partidaRepository.findByCodigoPartida(codigoPartida)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada"));
        
        return converterParaDTO(partida);
    }

    @Transactional
    public PartidaDTO entrarPartida(Long id, String username) {
        Partida partida = partidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada"));
        
        if (partida.getStatus() != Partida.StatusPartida.AGUARDANDO) {
            throw new RuntimeException("Esta partida já está em andamento ou finalizada");
        }
        
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (partida.getJogadorBrancas().equals(usuario)) {
            throw new RuntimeException("Você já está nesta partida");
        }
        
        // Adiciona o jogador à partida
        partida.setJogadorPretas(usuario);
        partida.setStatus(Partida.StatusPartida.EM_ANDAMENTO);
        
        partida = partidaRepository.save(partida);
        
        // Notifica os jogadores sobre o início da partida
        PartidaDTO partidaDTO = converterParaDTO(partida);
        messagingTemplate.convertAndSend("/topic/partida/" + partida.getId(), partidaDTO);
        
        return partidaDTO;
    }

    @Transactional
    public PartidaDTO realizarMovimento(Long id, MovimentoRequest request, String username) {
        Partida partida = partidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada"));
        
        if (partida.getStatus() != Partida.StatusPartida.EM_ANDAMENTO) {
            throw new RuntimeException("Esta partida não está em andamento");
        }
        
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Verifica se é a vez do jogador
        boolean isJogadorBrancas = partida.getJogadorBrancas().equals(usuario);
        boolean isJogadorPretas = partida.getJogadorPretas().equals(usuario);
        
        if (!isJogadorBrancas && !isJogadorPretas) {
            throw new RuntimeException("Você não é um jogador desta partida");
        }
        
        if ((partida.isJogadorAtualBrancas() && !isJogadorBrancas) || 
            (!partida.isJogadorAtualBrancas() && !isJogadorPretas)) {
            throw new RuntimeException("Não é sua vez de jogar");
        }
        
        // Converte o estado do tabuleiro de JSON para matriz
        int[][] tabuleiro = jogoDamasService.jsonParaTabuleiro(partida.getEstadoTabuleiro());
        
        // Verifica se o movimento é válido
        if (!jogoDamasService.isMovimentoValido(
                tabuleiro, 
                request.getLinhaOrigem(), 
                request.getColunaOrigem(), 
                request.getLinhaDestino(), 
                request.getColunaDestino(),
                partida.isJogadorAtualBrancas())) {
            throw new RuntimeException("Movimento inválido");
        }
        
        // Executa o movimento
        int[][] novoTabuleiro = jogoDamasService.executarMovimento(
                tabuleiro, 
                request.getLinhaOrigem(), 
                request.getColunaOrigem(), 
                request.getLinhaDestino(), 
                request.getColunaDestino(),
                partida.isJogadorAtualBrancas());
        
        // Salva o novo estado do tabuleiro
        partida.setEstadoTabuleiro(jogoDamasService.tabuleiroParaJson(novoTabuleiro));
        
        // Registra o movimento no histórico
        String movimento = request.getLinhaOrigem() + "," + request.getColunaOrigem() + ":" +
                          request.getLinhaDestino() + "," + request.getColunaDestino() + ";";
        partida.setMovimentoHistorico(partida.getMovimentoHistorico() + movimento);
        
        // Troca o jogador atual
        partida.setJogadorAtualBrancas(!partida.isJogadorAtualBrancas());
        
        // Verifica se o jogo acabou
        if (jogoDamasService.isJogoAcabou(novoTabuleiro)) {
            partida.setStatus(Partida.StatusPartida.FINALIZADA);
            partida.setDataFim(LocalDateTime.now());
            
            // Determina o vencedor
            Usuario vencedor = jogoDamasService.determinarVencedor(novoTabuleiro, 
                                                                partida.getJogadorBrancas(),
                                                                partida.getJogadorPretas());
            partida.setVencedor(vencedor);
            
            // Atualiza estatísticas do vencedor
            if (vencedor != null) {
                vencedor.setPartidasVencidas(vencedor.getPartidasVencidas() + 1);
                vencedor.setPontuacao(vencedor.getPontuacao() + 10);
                usuarioRepository.save(vencedor);
            }
            
            // Atualiza estatísticas de ambos os jogadores
            Usuario jogadorBrancas = partida.getJogadorBrancas();
            jogadorBrancas.setPartidasJogadas(jogadorBrancas.getPartidasJogadas() + 1);
            usuarioRepository.save(jogadorBrancas);
            
            Usuario jogadorPretas = partida.getJogadorPretas();
            jogadorPretas.setPartidasJogadas(jogadorPretas.getPartidasJogadas() + 1);
            usuarioRepository.save(jogadorPretas);
        }
        
        partida = partidaRepository.save(partida);
        
        // Notifica os jogadores sobre a atualização da partida
        PartidaDTO partidaDTO = converterParaDTO(partida);
        messagingTemplate.convertAndSend("/topic/partida/" + partida.getId(), partidaDTO);
        
        return partidaDTO;
    }

    @Transactional
    public PartidaDTO desistirPartida(Long id, String username) {
        Partida partida = partidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada"));
        
        if (partida.getStatus() != Partida.StatusPartida.EM_ANDAMENTO) {
            throw new RuntimeException("Esta partida não está em andamento");
        }
        
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        boolean isJogadorBrancas = partida.getJogadorBrancas().equals(usuario);
        boolean isJogadorPretas = partida.getJogadorPretas().equals(usuario);
        
        if (!isJogadorBrancas && !isJogadorPretas) {
            throw new RuntimeException("Você não é um jogador desta partida");
        }
        
        // Marca a partida como finalizada
        partida.setStatus(Partida.StatusPartida.ABANDONADA);
        partida.setDataFim(LocalDateTime.now());
        
        // Define o outro jogador como vencedor
        if (isJogadorBrancas) {
            partida.setVencedor(partida.getJogadorPretas());
        } else {
            partida.setVencedor(partida.getJogadorBrancas());
        }
        
        // Atualiza estatísticas dos jogadores
        Usuario vencedor = partida.getVencedor();
        vencedor.setPartidasVencidas(vencedor.getPartidasVencidas() + 1);
        vencedor.setPontuacao(vencedor.getPontuacao() + 10);
        vencedor.setPartidasJogadas(vencedor.getPartidasJogadas() + 1);
        usuarioRepository.save(vencedor);
        
        usuario.setPartidasJogadas(usuario.getPartidasJogadas() + 1);
        usuarioRepository.save(usuario);
        
        partida = partidaRepository.save(partida);
        
        // Notifica os jogadores sobre o fim da partida
        PartidaDTO partidaDTO = converterParaDTO(partida);
        messagingTemplate.convertAndSend("/topic/partida/" + partida.getId(), partidaDTO);
        
        return partidaDTO;
    }

    // Método para buscar partida pelo ID
    public Partida getPartidaById(Long id) {
        return partidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada"));
    }

    // Método para converter uma Partida em PartidaDTO
    public PartidaDTO converterParaDTO(Partida partida) {
        // Converte o tabuleiro de JSON para matriz
        int[][] tabuleiro = null;
        if (partida.getEstadoTabuleiro() != null) {
            tabuleiro = jogoDamasService.jsonParaTabuleiro(partida.getEstadoTabuleiro());
        }
        
        return PartidaDTO.builder()
                .id(partida.getId())
                .jogadorBrancas(converterUsuarioParaDTO(partida.getJogadorBrancas()))
                .jogadorPretas(partida.getJogadorPretas() != null ? converterUsuarioParaDTO(partida.getJogadorPretas()) : null)
                .dataInicio(partida.getDataInicio())
                .dataFim(partida.getDataFim())
                .tabuleiro(tabuleiro)
                .status(partida.getStatus())
                .vencedor(partida.getVencedor() != null ? converterUsuarioParaDTO(partida.getVencedor()) : null)
                .jogadorAtualBrancas(partida.isJogadorAtualBrancas())
                .tempoJogadorBrancas(partida.getTempoJogadorBrancas())
                .tempoJogadorPretas(partida.getTempoJogadorPretas())
                .codigoPartida(partida.getCodigoPartida())
                .movimentoHistorico(partida.getMovimentoHistorico())
                .build();
    }

    // Método para converter um Usuario em UsuarioDTO
    private UsuarioDTO converterUsuarioParaDTO(Usuario usuario) {
        if (usuario == null) {
            return null;
        }
        
        return UsuarioDTO.builder()
                .id(usuario.getId())
                .username(usuario.getUsername())
                .nomeCompleto(usuario.getNomeCompleto())
                .partidasJogadas(usuario.getPartidasJogadas())
                .partidasVencidas(usuario.getPartidasVencidas())
                .pontuacao(usuario.getPontuacao())
                .build();
    }
}