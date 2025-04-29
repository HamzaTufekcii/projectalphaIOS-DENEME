package com.projectalpha.dto;

import lombok.Data;

@Data
public class SupabaseTokenResponse {

    private String access_token;
    private String refresh_token;
    private User user;

    @Data
    public static class User {
        private String id;
        private String email;
    }

}
