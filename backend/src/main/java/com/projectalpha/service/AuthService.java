package com.projectalpha.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectalpha.config.SupabaseConfig;
import com.projectalpha.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
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

    public String getUserIdByEmail(String email) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(supabaseConfig.getSupabaseUrl() + "/auth/v1/admin/users"))
                .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                .header("apikey", supabaseConfig.getSupabaseApiKey())
                .header("Content-Type", "application/json")
                .build();

        var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        JsonNode root = mapper.readTree(response.body());
        JsonNode users = root.get("users");

        if (users != null && users.isArray()) {
            for (JsonNode user : users) {
                String userEmail = user.has("email") ? user.get("email").asText() : null;
                if (email.equals(userEmail)) {
                    return user.get("id").asText();  // UUID'yi döndür
                }
            }
        }
        throw new RuntimeException("Kullanıcı bulunamadı veya e-posta eşleşmedi.");
    }

    public void setPassword(String email, String newPassword) throws Exception {
        String userId = getUserIdByEmail(email);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(supabaseConfig.getSupabaseUrl() + "/auth/v1/admin/users/" + userId))
                .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey()) // service_role API key
                .header("Content-Type", "application/json")
                .header("apikey", supabaseConfig.getSupabaseApiKey())
                .method("PUT", HttpRequest.BodyPublishers.ofString("""
                        {
                            "password": "%s"
                        }
                """.formatted(newPassword)))
                .build();

        // Yanıtı almak için isteği gönderme
        var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Şifre güncellenemedi: " + response.body());
        }
    }


    public SupabaseTokenResponse loginWithEmailPassword(String email, String password) throws Exception {
        String jsonBody = """
        {
            "email": "%s",
            "password": "%s"
        }
    """.formatted(email, password);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(supabaseConfig.getSupabaseUrl() + "/auth/v1/token?grant_type=password"))
                .header("Content-Type", "application/json")
                .header("apikey", supabaseConfig.getSupabaseApiKey())
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 400) {
            throw new RuntimeException("Login başarısız: " + response.body());
        }

        return mapper.readValue(response.body(), SupabaseTokenResponse.class);
    }
}
