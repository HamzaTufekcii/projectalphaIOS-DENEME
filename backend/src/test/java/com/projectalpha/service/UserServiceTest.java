package com.projectalpha.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;

import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class UserServiceTest {

    @Mock
    private RestTemplate restTemplate;

    private UserService userService;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.apiKey}")
    private String supabaseApiKey;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService(restTemplate, supabaseUrl, supabaseApiKey);
    }

    @Test
    public void testRegisterUser() {
        String email = "test@example.com";
        String password = "password123";

        String mockResponse = "{\"access_token\":\"mocked_token\"}";
        ResponseEntity<String> mockResponseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);

        String expectedUrl = supabaseUrl + "/auth/v1/signup";

        when(restTemplate.postForEntity(expectedUrl,
                "{\"email\": \"" + email + "\",\"password\": \"" + password + "\"}",
                String.class)).thenReturn(mockResponseEntity);

        String result = userService.registerUser(email, password);

        assertEquals(mockResponse, result);
    }
}