package com.projectalpha.repository.businessTag.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectalpha.config.thirdparty.SupabaseConfig;
import com.projectalpha.dto.business.businessTag.BusinessTagDTO;
import com.projectalpha.repository.businessTag.BusinessTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

@Repository
public class BusinessTagRepositoryImpl implements BusinessTagRepository {
    private final SupabaseConfig supabaseConfig;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public BusinessTagRepositoryImpl(SupabaseConfig supabaseConfig) {
        this.supabaseConfig = supabaseConfig;
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    private List<BusinessTagDTO> fetchList(String path) {
        try {
            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/" + path;
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> r = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
            if (r.statusCode() >= 400) throw new RuntimeException("Request failed [" + path + "]: " + r.body());

            JsonNode root = objectMapper.readTree(r.body());
            List<BusinessTagDTO> list = new ArrayList<>();
            for (JsonNode n : root) list.add(objectMapper.treeToValue(n, BusinessTagDTO.class));
            return list;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching " + path, e);
        }
    }

    private BusinessTagDTO fetchSingle(String path) {
        List<BusinessTagDTO> list = fetchList(path);
        return list.isEmpty() ? null : list.get(0);
    }

    @Override
    public List<BusinessTagDTO> findAll() {
        return fetchList("business_tag?select=*");
    }

    @Override
    public BusinessTagDTO findById(String id) {
        return fetchSingle("business_tag?select=*&id=eq." + id);
    }

    @Override
    public List<BusinessTagDTO> findByBusinessId(String businessId) {
        return fetchList("business_tag?select=*&business_id=eq." + businessId);
    }

    @Override
    public List<BusinessTagDTO> findByTagId(String tagId) {
        return fetchList("business_tag?select=*&tag_id=eq." + tagId);
    }
}