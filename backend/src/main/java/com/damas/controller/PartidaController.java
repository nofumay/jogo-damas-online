package com.damas.controller;

import com.damas.dto.MovimentoRequest;
import com.damas.dto.NovaPartidaRequest;
import com.damas.dto.PartidaDTO;
import com.damas.model.Partida;
import com.damas.service.PartidaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partidas")
@RequiredArgsConstructor
public class PartidaController {

    private final PartidaService partidaService;

    @PostMapping
    public ResponseEntity<PartidaDTO> criarPartida(@RequestBody NovaPartidaRequest request, Authentication authentication) {
        return ResponseEntity.ok(partidaService.criarPartida(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<PartidaDTO>> listarMinhasPartidas(Authentication authentication) {
        return ResponseEntity.ok(partidaService.listarPartidasDoUsuario(authentication.getName()));
    }

    @GetMapping("/aguardando")
    public ResponseEntity<List<PartidaDTO>> listarPartidasAguardando() {
        return ResponseEntity.ok(partidaService.listarPartidasAguardando());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartidaDTO> obterPartida(@PathVariable Long id) {
        return ResponseEntity.ok(partidaService.obterPartida(id));
    }

    @GetMapping("/codigo/{codigoPartida}")
    public ResponseEntity<PartidaDTO> obterPartidaPorCodigo(@PathVariable String codigoPartida) {
        return ResponseEntity.ok(partidaService.obterPartidaPorCodigo(codigoPartida));
    }

    @PostMapping("/{id}/entrar")
    public ResponseEntity<PartidaDTO> entrarPartida(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(partidaService.entrarPartida(id, authentication.getName()));
    }

    @PostMapping("/{id}/movimento")
    public ResponseEntity<PartidaDTO> realizarMovimento(@PathVariable Long id, @RequestBody MovimentoRequest request, Authentication authentication) {
        return ResponseEntity.ok(partidaService.realizarMovimento(id, request, authentication.getName()));
    }

    @PostMapping("/{id}/desistir")
    public ResponseEntity<PartidaDTO> desistirPartida(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(partidaService.desistirPartida(id, authentication.getName()));
    }
    
    // WebSocket para notificações em tempo real
    @MessageMapping("/partida.movimento")
    @SendTo("/topic/partida")
    public PartidaDTO notificarMovimento(MovimentoRequest request) {
        Partida partida = partidaService.getPartidaById(request.getPartidaId());
        return partidaService.converterParaDTO(partida);
    }
}