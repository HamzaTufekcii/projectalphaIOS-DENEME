package com.projectalpha.repository.user.diner.impl;

import com.projectalpha.dto.ListDTO;
import com.projectalpha.dto.user.diner.DinerUserProfile;
import com.projectalpha.repository.user.diner.DinerRepository;
import com.projectalpha.config.thirdparty.SupabaseConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Optional;

@Repository
public class DinerRepositoryImpl implements DinerRepository {

    private final SupabaseConfig supabaseConfig;
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    public DinerRepositoryImpl(SupabaseConfig supabaseConfig) {
        this.supabaseConfig = supabaseConfig;
    }

    @Override
    public Optional<DinerUserProfile> findDinerByID(String userId) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(supabaseConfig.getSupabaseUrl() + "/rest/v1/user_profile_diner?user_id=eq." + userId))
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = mapper.readTree(response.body());
                if (root.isArray() && root.size() > 0) {
                    DinerUserProfile profile = mapper.treeToValue(root.get(0), DinerUserProfile.class);
                    return Optional.of(profile);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public void updateDinerProfile(String userId, DinerUserProfile profile) {
        try {
            // Güncellenebilir alanları JSON objesi yapıyoruz (id, email, created_at yok)
            String body = mapper.writeValueAsString(new DinerUpdateDTO(profile));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(supabaseConfig.getSupabaseUrl() + "/rest/v1/user_profile_diner?user_id=eq." + userId))
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
    } private static class DinerUpdateDTO {
        public String name;
        public String phone_numb;
        public String surname;
        public String address;

        public DinerUpdateDTO(DinerUserProfile profile) {
            this.name = profile.getName();
            this.phone_numb = profile.getPhone_numb();
            this.surname = profile.getSurname();
            this.address = profile.getAddress();
        }
    }

    @Override
    public List<ListDTO> findListsByUserId(String userId) {
        // TODO: Implement this method to fetch lists by userId from Supabase
        return null;
    }

    @Override
    public ListDTO createList(String userId, String listName) {
        // TODO: Implement this method to create a new list for userId in Supabase
        return null;
    }

    @Override
    public void addBusinessToList(String userId, String listId, String businessId) {
        // TODO: Implement this method to add a business to a list in Supabase
    }

    @Override
    public void removeBusinessFromList(String userId, String listId, String businessId) {
        // TODO: Implement this method to remove a business from a list in Supabase
    }


}