package com.damas.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "partidas")
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "jogador_brancas_id", nullable = false)
    private Usuario jogadorBrancas;
    
    @ManyToOne
    @JoinColumn(name = "jogador_pretas_id", nullable = false)
    private Usuario jogadorPretas;
    
    @Column(name = "data_inicio")
    private LocalDateTime dataInicio = LocalDateTime.now();
    
    @Column(name = "data_fim")
    private LocalDateTime dataFim;
    
    @Column(name = "estado_tabuleiro", columnDefinition = "TEXT")
    private String estadoTabuleiro;
    
    @Enumerated(EnumType.STRING)
    private StatusPartida status = StatusPartida.AGUARDANDO;
    
    @ManyToOne
    @JoinColumn(name = "vencedor_id")
    private Usuario vencedor;
    
    @Column(name = "jogador_atual")
    private boolean jogadorAtualBrancas = true; // true = brancas, false = pretas
    
    @Column(name = "tempo_jogador_brancas")
    private Integer tempoJogadorBrancas = 600; // 10 minutos em segundos
    
    @Column(name = "tempo_jogador_pretas")
    private Integer tempoJogadorPretas = 600; // 10 minutos em segundos
    
    @Column(name = "codigo_partida", unique = true)
    private String codigoPartida;
    
    @Column(name = "movimento_historico", columnDefinition = "TEXT")
    private String movimentoHistorico = "";
    
    public enum StatusPartida {
        AGUARDANDO, EM_ANDAMENTO, FINALIZADA, ABANDONADA
    }
}