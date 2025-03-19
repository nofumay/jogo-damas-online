package com.damas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NovaPartidaRequest {
    private boolean partidaPrivada;
    private Integer tempoPartida; // em segundos, null para sem limite
}