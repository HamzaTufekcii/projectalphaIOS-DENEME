package com.projectalpha.controller;

import com.projectalpha.dto.AuthRequest;
import com.projectalpha.dto.GenericResponse;
import com.projectalpha.dto.SupabaseTokenResponse;
import com.projectalpha.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/send-verification-code")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> body) {
        try {
            authService.sendVerificationCode(body.get("email"));
            return ResponseEntity.ok("Kod gönderildi.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Hata: " + e.getMessage());
        }
    }

    @PostMapping("/verify-verification-code")
    public ResponseEntity<?> verifyVerificationCode(@RequestBody Map<String, String> body) {
        try {
            SupabaseTokenResponse res = authService.verifyVerificationCode(body.get("email"), body.get("token"));
            return ResponseEntity.ok(Map.of("token", res.getAccess_token(), "userId", res.getUser().getId()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Doğrulama Hatalı: " + e.getMessage());
        }
    }

    @PostMapping("/set-password")
    public ResponseEntity<?> setPassword(@RequestBody Map<String, String> body) {
        try {
            authService.setPassword(body.get("userId"), body.get("password"));
            return ResponseEntity.ok("Şifre kaydedildi.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Şifre kaydedilemedi: " + e.getMessage());
        }
    }
}
