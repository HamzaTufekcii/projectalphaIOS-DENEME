package com.projectalpha.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class SupabaseTokenResponse {

    private String access_token;
    private String refresh_token;
    private User user;

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class User {
        private String id;
        private String email;
        private String role;
        private String email_confirmed_at;
    }
}
