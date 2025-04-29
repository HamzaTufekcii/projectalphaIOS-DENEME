package com.projectalpha.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectalpha.config.SupabaseConfig;
import com.projectalpha.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final SupabaseConfig supabaseConfig;
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    public AuthService(SupabaseConfig supabaseConfig) {
        this.supabaseConfig = supabaseConfig;
    }

    public void sendVerificationCode(String email) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(supabaseConfig.getSupabaseUrl() + "/auth/v1/otp"))
                .header("apikey", supabaseConfig.getSupabaseApiKey())
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("""
                    {
                        "email": "%s",
                        "create_user": true,
                        "data": { "tmp" : true }
                    }
                """.formatted(email)))
                .build();
            httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    }

    public SupabaseTokenResponse verifyVerificationCode(String email, String token) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(supabaseConfig.getSupabaseUrl() + "/auth/v1/verify"))
                .header("apikey", supabaseConfig.getSupabaseApiKey())
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("""
                    {
                        "email": "%s",
                        "token": "%s",
                        "type": "email"
                    }
                 """.formatted(email, token)))
                .build();
        var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        return mapper.readValue(response.body(), SupabaseTokenResponse.class);
    }

    public void setPassword(String userID, String password) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(supabaseConfig.getSupabaseUrl() + "/auth/v1/admin/users/" + userID))
                .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                .header("apikey", supabaseConfig.getSupabaseApiKey())
                .header("Content-Type", "application/json")
                .method("PATCH", HttpRequest.BodyPublishers.ofString("""
                        {"password". "%s"}
                """.formatted(password)))
                .build();
        httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    }







//Sergenin kodlars






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
