package com.projectalpha.repository.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectalpha.config.SupabaseConfig;
import com.projectalpha.exception.UserNotFoundException;
import com.projectalpha.exception.UserNotVerifiedException;
import com.projectalpha.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private final SupabaseConfig supabaseConfig;
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    public UserRepositoryImpl(SupabaseConfig supabaseConfig) {
        this.supabaseConfig = supabaseConfig;
    }
    
    @Override
    public String findUserIdByEmail(String email) throws Exception {
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
                    return user.get("id").asText();
                }
            }
        }
        return null;
    }
    @Override
    public String isVerified(String email) throws Exception {
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
                    JsonNode emailConfirmedAtNode = user.get("email_confirmed_at");
                    return emailConfirmedAtNode != null ? emailConfirmedAtNode.asText() : null;
                }
            }
        }
        return null;
    }
    @Override
    public String checkRole(String email) throws Exception {
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
                    JsonNode appMetaData = user.get("app_metadata");
                    if (appMetaData != null && appMetaData.has("role")) {
                        return appMetaData.get("role").asText();
                    }
                }
            }
        }
        return null;
    }


    @Override
    public void updateUserPasswordAndRole(String userId, String password, String role) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(supabaseConfig.getSupabaseUrl() + "/auth/v1/admin/users/" + userId))
                .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                .header("Content-Type", "application/json")
                .header("apikey", supabaseConfig.getSupabaseApiKey())
                .method("PUT", HttpRequest.BodyPublishers.ofString("""
                        {
                            "password": "%s",
                            "app_metadata": {
                                "role": "%s"
                             }
                        }
                """.formatted(password, role)))
                .build();

        var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("User update failed: " + response.body());
        }
    }
} 