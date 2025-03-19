package com.damas.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuarios")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String senha;
    
    @Column(name = "nome_completo")
    private String nomeCompleto;
    
    private int partidasJogadas = 0;
    
    private int partidasVencidas = 0;
    
    private int pontuacao = 0;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "usuario_roles", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "role")
    private Set<String> roles = new HashSet<>();
    
    @Column(nullable = false)
    private boolean ativo = true;
    
    @Column(name = "data_cadastro")
    private java.time.LocalDateTime dataCadastro = java.time.LocalDateTime.now();
    
    @Column(name = "ultimo_acesso")
    private java.time.LocalDateTime ultimoAcesso;
}