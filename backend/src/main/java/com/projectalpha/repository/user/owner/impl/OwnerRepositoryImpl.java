package com.projectalpha.repository.user.owner.impl;

import com.projectalpha.dto.user.owner.OwnerUserProfile;
import com.projectalpha.repository.user.owner.OwnerRepository;
import com.projectalpha.config.thirdparty.SupabaseConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Optional;

@Repository
public class OwnerRepositoryImpl implements OwnerRepository {

    private final SupabaseConfig supabaseConfig;
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    public OwnerRepositoryImpl(SupabaseConfig supabaseConfig) {
        this.supabaseConfig = supabaseConfig;
    }

    @Override
    public Optional<OwnerUserProfile> findOwnerByID(String userId) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(supabaseConfig.getSupabaseUrl() + "/rest/v1/user_profile_owner?user_id=eq." + userId))
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = mapper.readTree(response.body());
                if (root.isArray() && root.size() > 0) {
                    OwnerUserProfile profile = mapper.treeToValue(root.get(0), OwnerUserProfile.class);
                    return Optional.of(profile);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public void updateOwnerProfile(String userId, OwnerUserProfile profile) {
        try {
            String body = mapper.writeValueAsString(new OwnerUpdateDTO(profile));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(supabaseConfig.getSupabaseUrl() + "/rest/v1/user_profile_owner?user_id=eq." + userId))
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .method("PATCH", HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new RuntimeException("Update failed: " + response.body());
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static class OwnerUpdateDTO {
        public String name;
        public String phone_numb;
        public String surname;
        public String address;

        public OwnerUpdateDTO(OwnerUserProfile profile) {
            this.name = profile.getName();
            this.phone_numb = profile.getPhone_numb();
            this.surname = profile.getSurname();
            this.address = profile.getAddress();
        }
    }
}