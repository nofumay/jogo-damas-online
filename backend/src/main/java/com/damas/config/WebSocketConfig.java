package com.damas.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Prefixo para mensagens destinadas ao cliente
        registry.enableSimpleBroker("/topic", "/queue");
        
        // Prefixo para mensagens destinadas ao servidor
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint para conexões WebSocket, com fallback SockJS
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000", "https://jogo-damas-online.netlify.app")
                .withSockJS();
    }
}