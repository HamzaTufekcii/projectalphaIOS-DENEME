package com.projectalpha.repository.user.diner.impl;

import com.projectalpha.dto.business.Business;
import com.projectalpha.dto.business.BusinessDTO;
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
import org.springframework.boot.actuate.autoconfigure.observation.ObservationProperties;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;
import java.util.stream.Collectors;

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


    // List Implementation//
    @Override
    public List<BusinessDTO> getDinerListItems(String userId,String listId){

        try {
            // Kullanıcının diner profil ID'sini al
            Optional<DinerUserProfile> profile = findDinerByID(userId);
            String dinerId = profile
                    .map(DinerUserProfile::getId)
                    .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı"));

            String listUrl = supabaseConfig.getSupabaseUrl() +
                    "/rest/v1/custom_list_item?select=business_id&list_id=eq." + listId;

            HttpRequest listRequest = HttpRequest.newBuilder()
                    .uri(URI.create(listUrl))
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> listResponse = httpClient.send(listRequest, HttpResponse.BodyHandlers.ofString());


            if (listResponse.statusCode() != 200) {
                throw new RuntimeException("Liste item'ları alınamadı: " + listResponse.body());
            }

            JsonNode listRoot = mapper.readTree(listResponse.body());
            if (!listRoot.isArray() || listRoot.size() == 0) {
                return new ArrayList<>();
            }

            List<String> businessIds = new ArrayList<>();
            for (JsonNode node : listRoot) {
                businessIds.add(node.get("business_id").asText());
            }


            String businessQuery = businessIds.stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining(","));


            String businessUrl = supabaseConfig.getSupabaseUrl() +
                    "/rest/v1/business?select=*&id=in.(" + businessQuery + ")";



            HttpRequest businessRequest = HttpRequest.newBuilder()
                    .uri(URI.create(businessUrl))
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> businessResponse = httpClient.send(businessRequest, HttpResponse.BodyHandlers.ofString());

            if (businessResponse.statusCode() != 200) {
                throw new RuntimeException("İşletmeler alınamadı: " + businessResponse.body());
            }


            JsonNode businessRoot = mapper.readTree(businessResponse.body());
            List<BusinessDTO> businesses = new ArrayList<>();
            if (businessRoot.isArray()) {
                for (JsonNode business : businessRoot) {
                    businesses.add(mapper.treeToValue(business, BusinessDTO.class));
                }
            }

            return businesses;

        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public List<CustomList> getDinerLists(String userId) {
    try {
        Optional<DinerUserProfile> profile = findDinerByID(userId);
        String dinerId = profile
                .map(DinerUserProfile::getId)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı"));

        String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/custom_list?user_profile_diner_id=eq." + dinerId;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("apikey", supabaseConfig.getSupabaseApiKey())
                .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                .header("Content-Type", "application/json")
                .GET()
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 400) {
            throw new RuntimeException("Listeler alınamadı: " + response.body());
        }
        JsonNode root = mapper.readTree(response.body());
        List<CustomList> listOfBusinesses = new ArrayList<>();

        if (root.isArray()) {
            for (JsonNode node : root) {
                CustomList business = mapper.treeToValue(node, CustomList.class);
                listOfBusinesses.add(business);
            }
        }

        return listOfBusinesses;

    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Listeler alınırken hata oluştu: " + e.getMessage());
    }

    }

    @Override
    public CustomList createDinerList(String userId, CustomListRequest createRequest) {

        try {
            Optional<DinerUserProfile> profile = findDinerByID(userId);
            String dinerId = profile
                    .map(DinerUserProfile::getId)
                    .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı"));

            Map<String, Object> createPayload = Map.of(
                    "name", createRequest.getName(),
                    "user_id", userId,
                    "user_profile_diner_id", dinerId,
                    "is_public", createRequest.isPublic(),
                    "like_counter", createRequest.getLikeCount()
            );

            String requestBody = mapper.writeValueAsString(createPayload);

            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/custom_list";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .header("Prefer", "return=representation")
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                throw new RuntimeException("Liste oluşturulamadı: " + response.body());
            }

            JsonNode root = mapper.readTree(response.body());
            if (!root.isArray() || root.size() == 0) {
                throw new RuntimeException("Boş Supabase cevabı");
            }

            return mapper.treeToValue(root.get(0), CustomList.class);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Liste oluşturulurken hata: " + e.getMessage());
        }
    }
    @Override
    public CustomList updateDinerList(String userId, String listId, CustomListRequest updateRequest){
        try{
        //DinerId elde edilmesi
        Optional<DinerUserProfile> profile = findDinerByID(userId);
        String dinerId = profile
                .map(DinerUserProfile::getId)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı"));

        Map<String, Object> updatePayload = Map.of(
                "name", updateRequest.getName(),
                "is_public",updateRequest.isPublic(),
                "like_counter", updateRequest.getLikeCount()
        );

        String requestBody = mapper.writeValueAsString(updatePayload);

        String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/custom_list?id=eq." + listId;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .method("PATCH", HttpRequest.BodyPublishers.ofString(requestBody))
                .header("apikey", supabaseConfig.getSupabaseApiKey())
                .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                .header("Content-Type", "application/json")
                .header("Prefer", "return=representation")
                .build();

        HttpResponse<String> response = httpClient.send(request,HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new RuntimeException("Liste güncellenmedi: " + response.body());
            }

            JsonNode root = mapper.readTree(response.body());
            if (!root.isArray() || root.size() == 0) {
                throw new RuntimeException("Boş Supabase cevabı");
            }

            CustomList responseCustomList = mapper.treeToValue(root.get(0), CustomList.class);
            return responseCustomList;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Liste güncellenirken hata: " + e.getMessage());
        }


    }


    @Override
    public String createListItem(String userId, String businessId, String listId) {//401 Error
        try {

            Optional<DinerUserProfile> profile = findDinerByID(userId);
            String dinerId = profile
                    .map(DinerUserProfile::getId)
                    .orElse("ID ile sorgu başarısız.");

            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/custom_list_item";


            Map<String, Object> data = Map.of(
                    "diner_id", dinerId,
                    "business_id", businessId,
                    "list_id", listId
            );
            String requestBody = mapper.writeValueAsString(data);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .header("Prefer", "return=representation") //  burada minimal yerine temsil (id dahil) istiyoruz
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                throw new RuntimeException("Liste öğesi eklenemedi: " + response.body());
            }
            //
            System.out.printf(response.body());
            //
            // Supabase response'u bir array döner: [{ "id": "...", ... }]
            JsonNode root = mapper.readTree(response.body());
            String generatedId = root.get(0).get("id").asText();

            return generatedId;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("createListItem hatası: " + e.getMessage());
        }
    }


    @Override
    public void removeListItem(String userId, String listItemId) {
        try {
            Optional<DinerUserProfile> profile = findDinerByID(userId);
            String dinerId = profile
                    .map(DinerUserProfile::getId)
                    .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı"));

            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/custom_list_item?id=eq." + listItemId;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .method("DELETE", HttpRequest.BodyPublishers.noBody())
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .header("Prefer", "return=minimal")
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                throw new RuntimeException("İşletme listeden silinemedi: " + response.body());
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Silme işlemi sırasında hata oluştu: " + e.getMessage());
        }
        }

    @Override
    public void removeDinerList(String userId, String listId){
        //dinerId elde edilmesi
        try{
        Optional<DinerUserProfile> profile = findDinerByID(userId);
        String dinerId = profile
                .map(DinerUserProfile::getId)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı"));


        String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/custom_list?id=eq." + listId;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .method("DELETE", HttpRequest.BodyPublishers.noBody())
                .header("apikey", supabaseConfig.getSupabaseApiKey())
                .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                .header("Content-Type", "application/json")
                .header("Prefer", "return=minimal")
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                throw new RuntimeException("Liste silinemedi: " + response.body());
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Silme işlemi sırasında hata oluştu: " + e.getMessage());
        }

    }

}