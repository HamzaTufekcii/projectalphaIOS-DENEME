package com.projectalpha.dto.thirdparty;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class SupabaseTokenResponse {

    private String access_token;
    private String refresh_token;
    private User user;

    
    public String getAccess_token() {
        return access_token;
    }

    public void setAccess_token(String access_token) {
        this.access_token = access_token;
    }

    public String getRefresh_token() {
        return refresh_token;
    }

    public void setRefresh_token(String refresh_token) {
        this.refresh_token = refresh_token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class User {
        private String id;
        private String email;
        private String email_confirmed_at;
        private AppMetaData app_metadata;

        // Getters and setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getEmail_confirmed_at() {
            return email_confirmed_at;
        }

        public void setEmail_confirmed_at(String email_confirmed_at) {
            this.email_confirmed_at = email_confirmed_at;
        }

        public AppMetaData getApp_metadata() {
            return app_metadata;
        }

        public void setApp_metadata(AppMetaData app_metadata) {
            this.app_metadata = app_metadata;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class AppMetaData {
        private String role;
        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}
