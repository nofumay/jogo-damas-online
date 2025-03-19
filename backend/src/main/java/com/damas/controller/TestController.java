package com.damas.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping("/hello")
    public ResponseEntity<Map<String, String>> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello, World!");
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> simpleRegister(@RequestBody Map<String, String> user) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Usuário registrado com sucesso (simulado)");
        response.put("username", user.get("username"));
        return ResponseEntity.ok(response);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/cors")
    public ResponseEntity<String> testCors() {
        return ResponseEntity.ok("CORS está funcionando!");
    }
}
