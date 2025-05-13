package com.projectalpha.controller;

import com.projectalpha.dto.*;
import com.projectalpha.dto.GenericResponse;
import com.projectalpha.dto.SupabaseTokenResponse;
import com.projectalpha.exception.*;
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

    @PostMapping("/update-user")
    public ResponseEntity<?> updateUser(@RequestBody Map<String, String> body) {
        try {
            authService.updateUser(body.get("email"), body.get("password"), body.get("role"));
            return ResponseEntity.ok("Şifre başarıyla kaydedildi.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Şifre kaydedilemedi: " + e.getMessage());
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String password = body.get("password");
            SupabaseTokenResponse response = authService.loginWithEmailPassword(email, password);
            return ResponseEntity.ok(Map.of(
                    "access_token", response.getAccess_token(),
                    "refresh_token", response.getRefresh_token(),
                    "user", response.getUser()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Login Hatalı: " + e.getMessage());
        }
    }
}
