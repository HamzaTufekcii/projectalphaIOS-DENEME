package com.projectalpha.repository.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectalpha.config.SupabaseConfig;
import com.projectalpha.dto.SupabaseTokenResponse;
import com.projectalpha.repository.AuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Repository
public class AuthRepositoryImpl implements AuthRepository {

    private final SupabaseConfig supabaseConfig;
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    public AuthRepositoryImpl(SupabaseConfig supabaseConfig) {
        this.supabaseConfig = supabaseConfig;
    }

    @Override
    public void sendVerificationCode(String email) throws Exception {
        System.out.println("Sending verification code to email: " + email);
        System.out.println("Supabase URL: " + supabaseConfig.getSupabaseUrl());
        
        String requestBody = """
                {
                    "email": "%s",
                    "create_user": true,
                    "data": { "tmp": true }
                }
            """.formatted(email);
        
        System.out.println("Request body: " + requestBody);
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(supabaseConfig.getSupabaseUrl() + "/auth/v1/otp"))
                .header("apikey", supabaseConfig.getSupabaseApiKey())
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();
                
        var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        System.out.println("Response status code: " + response.statusCode());
        System.out.println("Response body: " + response.body());
        
        if (response.statusCode() >= 400) {
            throw new RuntimeException("Failed to send verification code. Status code: " + 
                response.statusCode() + ", Response: " + response.body());
        }
    }

    @Override
    public SupabaseTokenResponse verifyToken(String email, String token) throws Exception {
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
        
        if (response.statusCode() >= 400) {
            throw new RuntimeException("Token verification failed: " + response.body());
        }
        
        return mapper.readValue(response.body(), SupabaseTokenResponse.class);
    }

    @Override
    public SupabaseTokenResponse authenticateUser(String email, String password) throws Exception {
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
            throw new RuntimeException("Authentication failed: " + response.body());
        }

        return mapper.readValue(response.body(), SupabaseTokenResponse.class);
    }
} 