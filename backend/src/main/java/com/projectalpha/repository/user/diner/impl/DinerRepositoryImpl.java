package com.projectalpha.repository.user.diner.impl;

import com.projectalpha.dto.user.diner.DinerUpdateRequest;
import com.projectalpha.dto.user.diner.DinerUserProfile;
import com.projectalpha.dto.user.diner.custom_lists.CustomList;
import com.projectalpha.dto.user.diner.custom_lists.CustomListRequest;
import com.projectalpha.dto.user.diner.custom_lists.listItem.CustomListItemRequest;
import com.projectalpha.repository.user.diner.DinerRepository;
import com.projectalpha.config.thirdparty.SupabaseConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectalpha.repository.user.diner.custom_lists.ListRepository;
import com.projectalpha.repository.user.diner.custom_lists.listItem.FavoritesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class DinerRepositoryImpl implements DinerRepository, FavoritesRepository, ListRepository {

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
            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/user_profile_diner?select=" + "&user_id=eq." + userId;
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
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
    public void updateDinerProfile(String userId, DinerUpdateRequest request) {
        try {
            Map<String, Object> profilePayload = Map.of(
                    "name", request.getRequestDiner().getName(),
                    "surname", request.getRequestDiner().getSurname(),
                    "phone_numb", request.getRequestDiner().getPhone_numb()
            );

            String profileJson = mapper.writeValueAsString(profilePayload);

            //user_id ile satırı bul. ilgili kolonun bilgilerini değiştir.
            String column = "id";
            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/user_profile_diner?select=" + column + "&user_id=eq." + userId;

            HttpRequest profileRequest = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .header("Prefer", "return=minimal")
                    .method("PATCH", HttpRequest.BodyPublishers.ofString(profileJson))
                    .build();

            HttpResponse<String> response = httpClient.send(profileRequest, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new RuntimeException("Update failed: " + response.body());
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<CustomList> getDinerLists(String userId) {
        // TODO: Implement this method to fetch lists by userId from Supabase
        return null;
    }

    @Override
    public CustomList createList(String userId, CustomListRequest createRequest) {
        // TODO: Implement this method to create a new list for userId in Supabase
        return null;
    }
    @Override
    public void updateDinerList(String userId, String listId, CustomListRequest updateRequest){
        // TODO: Implement this method to update a list owned by diner
    }

    @Override
    public void addDinerFavoriteItem(String userId, String listItemId, String listId) {
        // TODO: Implement this method to add a business to a list in Supabase
    }
    @Override
    public void createFavoriteItem(String userId, CustomListItemRequest createRequest) {
        // TODO: Implement this method to add a business to favorites in Supabase
    }

    @Override
    public void removeDinerFavoriteItem(String userId, String listItemId) {
        // TODO: Implement this method to remove a business from a list in Supabase
    }

    @Override
    public void removeDinerList(String userId, String listId){
        // TODO: Implement this method to remove a business from favorites in Supabase
    }
    @Override
    public List<CustomList> getDinerFavorites(String userId){
        // TODO: Implement this method to get a favorites from Supabase
        return null;
    }
}