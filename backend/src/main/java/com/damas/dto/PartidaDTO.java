package com.damas.dto;

import com.damas.model.Partida;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PartidaDTO {
    private Long id;
    private UsuarioDTO jogadorBrancas;
    private UsuarioDTO jogadorPretas;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private int[][] tabuleiro;
    private Partida.StatusPartida status;
    private UsuarioDTO vencedor;
    private boolean jogadorAtualBrancas;
    private Integer tempoJogadorBrancas;
    private Integer tempoJogadorPretas;
    private String codigoPartida;
    private String movimentoHistorico;
}