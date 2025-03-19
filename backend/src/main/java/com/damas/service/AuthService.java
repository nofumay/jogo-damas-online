package com.damas.service;

import com.damas.dto.AuthRequest;
import com.damas.dto.AuthResponse;
import com.damas.dto.RegisterRequest;
import com.damas.model.Usuario;
import com.damas.repository.UsuarioRepository;
import com.damas.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        // Verificar se o usuário já existe
        if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Nome de usuário já está em uso");
        }
        
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email já está em uso");
        }
        
        var usuario = Usuario.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .senha(passwordEncoder.encode(request.getSenha()))
                .nomeCompleto(request.getNomeCompleto())
                .roles(Collections.singleton("USER"))
                .dataCadastro(LocalDateTime.now())
                .build();
        
        usuarioRepository.save(usuario);
        
        var jwtToken = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
                usuario.getUsername(),
                usuario.getSenha(),
                Collections.emptyList()
        ));
        
        return AuthResponse.builder()
                .token(jwtToken)
                .username(usuario.getUsername())
                .userId(usuario.getId())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        // Autentica o usuário
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getSenha()
                )
        );
        
        // Busca o usuário
        var usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Atualiza a data do último acesso
        usuario.setUltimoAcesso(LocalDateTime.now());
        usuarioRepository.save(usuario);
        
        // Gera o token JWT
        var jwtToken = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
                usuario.getUsername(),
                usuario.getSenha(),
                Collections.emptyList()
        ));
        
        return AuthResponse.builder()
                .token(jwtToken)
                .username(usuario.getUsername())
                .userId(usuario.getId())
                .build();
    }
    
    public boolean validateToken(String token) {
        try {
            String username = jwtService.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            return jwtService.isTokenValid(token, userDetails);
        } catch (Exception e) {
            return false;
        }
    }
}