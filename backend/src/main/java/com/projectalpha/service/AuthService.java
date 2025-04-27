package com.projectalpha.service;

import com.projectalpha.config.SupabaseConfig;
import com.projectalpha.dto.AuthRequest;
import com.projectalpha.dto.GenericResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final SupabaseConfig supabaseConfig;

    @Autowired
    public AuthService(SupabaseConfig supabaseConfig) {
        this.supabaseConfig = supabaseConfig;
    }

    public ResponseEntity<GenericResponse> signup(AuthRequest request) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String signupUrl = supabaseConfig.getSupabaseUrl() + "/auth/v1/signup";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + supabaseConfig.getSupabaseApiKey());
            headers.set("apikey", supabaseConfig.getSupabaseApiKey());

            Map<String, String> body = Map.of(
                    "email", request.getEmail(),
                    "password", request.getPassword()
            );

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    signupUrl,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            Map<String, String> data = new HashMap<>();
            data.put("email", request.getEmail());

            return ResponseEntity.ok(new GenericResponse(true, "Signup başarılı", data));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new GenericResponse(false, "Signup hatası: " + e.getMessage(), null));
        }
    }

    public ResponseEntity<GenericResponse> login(AuthRequest request) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String loginUrl = supabaseConfig.getSupabaseUrl() + "/auth/v1/token?grant_type=password";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + supabaseConfig.getSupabaseApiKey());
            headers.set("apikey", supabaseConfig.getSupabaseApiKey());

            Map<String, String> body = Map.of(
                    "email", request.getEmail(),
                    "password", request.getPassword()
            );

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    loginUrl,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, String> data = new HashMap<>();
                data.put("access_token", "Token buraya parse edilecek");
                // İleride istersen buraya JSON parse ederek access_token'ı ayrıştırırız.
                return ResponseEntity.ok(new GenericResponse(true, "Login başarılı", data));
            } else {
                return ResponseEntity.status(response.getStatusCode())
                        .body(new GenericResponse(false, "Login başarısız", null));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new GenericResponse(false, "Login hatası: " + e.getMessage(), null));
        }
    }
}
