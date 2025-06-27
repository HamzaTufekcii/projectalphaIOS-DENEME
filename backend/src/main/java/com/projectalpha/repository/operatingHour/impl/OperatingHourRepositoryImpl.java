package com.projectalpha.repository.operatingHour.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectalpha.config.thirdparty.SupabaseConfig;
import com.projectalpha.dto.business.operatingHour.OperatingHourDTO;
import com.projectalpha.repository.operatingHour.OperatingHourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

@Repository
public class OperatingHourRepositoryImpl implements OperatingHourRepository {
    private final SupabaseConfig supabaseConfig;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public OperatingHourRepositoryImpl(SupabaseConfig supabaseConfig) {
        this.supabaseConfig = supabaseConfig;
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public List<OperatingHourDTO> getAllOperatingHours() {
        try {
            String url = supabaseConfig.getSupabaseUrl()
                    + "/rest/v1/operating_hour?select=*";
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new RuntimeException("Saatler alınamadı: " + response.body());
            }
            JsonNode root = objectMapper.readTree(response.body());
            List<OperatingHourDTO> listOfOperatingHours = new ArrayList<>();

            if (root.isArray()) {
                for (JsonNode node : root) {
                    OperatingHourDTO operatingHour = objectMapper.treeToValue(node, OperatingHourDTO.class);
                    listOfOperatingHours.add(operatingHour);
                }
            }

            return listOfOperatingHours;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Çalışma saatleri alınırken hata oluştu: " + e.getMessage());
        }
    }

    @Override
    public List<OperatingHourDTO> getOperatingHoursByBusinessId(String businessId) {
        try {
            String url = supabaseConfig.getSupabaseUrl()
                    + "/rest/v1/operating_hour?select=*&business_id=eq." + businessId;
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new RuntimeException("Saatler alınamadı: " + response.body());
            }
            JsonNode root = objectMapper.readTree(response.body());
            List<OperatingHourDTO> listOfOperatingHours = new ArrayList<>();

            if (root.isArray()) {
                for (JsonNode node : root) {
                    OperatingHourDTO operatingHour = objectMapper.treeToValue(node, OperatingHourDTO.class);
                    listOfOperatingHours.add(operatingHour);
                }
            }

            return listOfOperatingHours;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Çalışma saatleri alınırken hata oluştu: " + e.getMessage());
        }
    }
}
