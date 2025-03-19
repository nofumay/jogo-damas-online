package com.damas.repository;

import com.damas.model.Partida;
import com.damas.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PartidaRepository extends JpaRepository<Partida, Long> {
    List<Partida> findByJogadorBrancasOrJogadorPretas(Usuario jogador1, Usuario jogador2);
    
    @Query("SELECT p FROM Partida p WHERE (p.jogadorBrancas = ?1 OR p.jogadorPretas = ?1) AND p.status = 'EM_ANDAMENTO'")
    List<Partida> findPartidasEmAndamentoByJogador(Usuario jogador);
    
    Optional<Partida> findByCodigoPartida(String codigoPartida);
    
    @Query("SELECT p FROM Partida p WHERE p.status = 'AGUARDANDO'")
    List<Partida> findPartidasAguardando();
}