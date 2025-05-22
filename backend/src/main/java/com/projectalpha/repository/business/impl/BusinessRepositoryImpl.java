package com.projectalpha.repository.business.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectalpha.config.thirdparty.SupabaseConfig;
import com.projectalpha.dto.business.BusinessDTO;
import com.projectalpha.repository.business.BusinessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Repository implementation using Supabase REST API via HTTP calls.
 * Mirrors the pattern of AuthRepositoryImpl.
 */
@Repository
public class BusinessRepositoryImpl implements BusinessRepository {

    private final SupabaseConfig supabaseConfig;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public BusinessRepositoryImpl(SupabaseConfig supabaseConfig) {
        this.supabaseConfig = supabaseConfig;
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    private List<BusinessDTO> fetchList(String path) {
        try {
            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/" + path;
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new RuntimeException("Request failed [" + path + "]: " + response.body());
            }

            JsonNode root = objectMapper.readTree(response.body());
            List<BusinessDTO> result = new ArrayList<>();
            for (JsonNode node : root) {
                result.add(objectMapper.treeToValue(node, BusinessDTO.class));
            }
            return result;

        } catch (Exception e) {
            throw new RuntimeException("Error fetching " + path, e);
        }
    }

    private BusinessDTO fetchSingle(String path) {
        List<BusinessDTO> list = fetchList(path);
        return list.isEmpty() ? null : list.get(0);
    }

    @Override
    public List<BusinessDTO> findAll() {
        // select all fields
        return fetchList("business?select=*");
    }

    @Override
    public BusinessDTO findById(String id) {
        // filter by id
        return fetchSingle("business?select=*&id=eq." + id);
    }

    @Override
    public List<BusinessDTO> findByNameContainingIgnoreCase(String name) {
        // case-insensitive 'ilike'
        return fetchList("business?select=*&name=ilike.*" + name + "*");
    }

    @Override
    public List<BusinessDTO> findByOwnerId(Long ownerId) {
        return fetchList("business?select=*&owner_id1=eq." + ownerId);
    }

    @Override
    public List<BusinessDTO> findTop5ByOrderByAvgRatingDesc() {
        return fetchList("business?select=*&order=avg_rating.desc&limit=5");
    }

    @Override
    public List<BusinessDTO> findWithActivePromotions() {
        return fetchList("business?select=*,promotions(*)&promotions.start_time=lte.now&promotions.end_time=gte.now");
    }

    @Override
    public List<BusinessDTO> findByTag(UUID tagId) {
        return fetchList("business?select=*&tags=eq." + tagId);
    }
}
