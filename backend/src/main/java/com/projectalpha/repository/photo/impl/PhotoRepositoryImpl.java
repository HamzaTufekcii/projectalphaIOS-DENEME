package com.projectalpha.repository.photo.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectalpha.config.thirdparty.SupabaseConfig;
import com.projectalpha.dto.business.photo.PhotoDTO;
import com.projectalpha.repository.photo.PhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PhotoRepositoryImpl implements PhotoRepository {
    private final SupabaseConfig supabaseConfig;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public PhotoRepositoryImpl(SupabaseConfig supabaseConfig) {
        this.supabaseConfig = supabaseConfig;
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    private List<PhotoDTO> fetchList(String path) {
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
            List<PhotoDTO> list = new ArrayList<>();
            for (JsonNode n : root) list.add(objectMapper.treeToValue(n, PhotoDTO.class));
            return list;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching " + path, e);
        }
    }

    private PhotoDTO fetchSingle(String path) {
        List<PhotoDTO> list = fetchList(path);
        return list.isEmpty() ? null : list.get(0);
    }

    @Override
    public List<PhotoDTO> findAll() {
        return fetchList("photo?select=*");
    }

    @Override
    public PhotoDTO findById(String id) {
        return fetchSingle("photo?select=*&id=eq." + id);
    }

    @Override
    public List<PhotoDTO> findByBusinessId(String businessId) {
        return fetchList("photo?select=*&business_id=eq." + businessId);
    }
}