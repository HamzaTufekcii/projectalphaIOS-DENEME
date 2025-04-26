
package com.projectalpha.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@Service
public class UserService {

    private final RestTemplate restTemplate;
    private final String supabaseUrl;
    private final String supabaseApiKey;

    public UserService(RestTemplate restTemplate,
                       @Value("${supabase.url}") String supabaseUrl,
                       @Value("${supabase.apiKey}") String supabaseApiKey) {
        this.restTemplate = restTemplate;
        this.supabaseUrl = supabaseUrl;
        this.supabaseApiKey = supabaseApiKey;
    }

    public String registerUser(String email, String password) {
        String url = supabaseUrl + "/auth/v1/signup";

        String body = "{"
                + "\"email\": \"" + email + "\","
                + "\"password\": \"" + password + "\""
                + "}";

        ResponseEntity<String> response = restTemplate.postForEntity(url, body, String.class);

        if (response == null || response.getBody() == null || response.getBody().isEmpty()) {
            throw new RuntimeException("Failed to register user. Response was null or empty.");
        }

        return response.getBody();
    }
}