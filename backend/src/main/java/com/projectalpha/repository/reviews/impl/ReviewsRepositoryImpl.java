package com.projectalpha.repository.reviews.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectalpha.config.thirdparty.SupabaseConfig;
import com.projectalpha.dto.review.ReviewSupabase;
import com.projectalpha.dto.review.newReviewRequest;
import com.projectalpha.dto.user.diner.DinerUserProfile;
import com.projectalpha.dto.user.diner.custom_lists.CustomList;
import com.projectalpha.repository.reviews.ReviewsRepository;
import com.projectalpha.repository.user.diner.DinerRepository;
import com.projectalpha.repository.user.diner.impl.DinerRepositoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class ReviewsRepositoryImpl implements ReviewsRepository {

    private final SupabaseConfig supabaseConfig;
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();
    private final DinerRepository dinerRepository;

    @Autowired
    public ReviewsRepositoryImpl(SupabaseConfig supabaseConfig, DinerRepository dinerRepository) {
        this.supabaseConfig = supabaseConfig;
        this.dinerRepository = dinerRepository;
    }

    public List<ReviewSupabase> getReviewByUserId(String userId) {
        try {
            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/review?user_id=eq." + userId;
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(java.net.URI.create(url))
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                throw new RuntimeException("Değerlendirmeler alınamadı: " + response.body());
            }
            JsonNode root = mapper.readTree(response.body());
            List<ReviewSupabase> listOfReviews = new ArrayList<>();

            if (root.isArray()) {
                for (JsonNode node : root) {
                    ReviewSupabase review = mapper.treeToValue(node, ReviewSupabase.class);
                    listOfReviews.add(review);
                }
            }

            return listOfReviews;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Değerlendirmeler alınırken hata oluştu: " + e.getMessage());
        }
    }

    public void saveReview(String userId, String businessId, newReviewRequest request){
        try {
            Map<String, Object> reviewPayload = Map.of(
                    "comment", request.getComment(),
                    "rating", request.getRating(),
                    "created_at", OffsetDateTime.now().toString(),
                    "business_id", businessId,
                    "user_id", userId
            );

            String reviewsJson = mapper.writeValueAsString(reviewPayload);
            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/review";
            HttpRequest reviewRequest = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .POST(HttpRequest.BodyPublishers.ofString(reviewsJson))
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .header("Prefer", "return=representation") //  burada minimal yerine temsil (id dahil) istiyoruz
                    .build();

            HttpResponse<String> response = httpClient.send(reviewRequest, HttpResponse.BodyHandlers.ofString());
            //burayı bir gözden geçireceğim. -izzet han

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Değerlendirme oluşturulurken hata oluştu: " + e.getMessage());
        }
    }

    public void deleteReview(String reviewId){
        try {
            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/review/" + reviewId;
            HttpRequest reviewRequest = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .DELETE()
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .build();
            HttpResponse<String> response = httpClient.send(reviewRequest, HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Değerlendirme silinirken hata oluştu: " + e.getMessage());
        }
    }

    public List<ReviewSupabase> getReviewsByBusinessId(String businessId) {
        try {
            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/review?business_id=eq." + businessId;
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new RuntimeException("Değerlendirmeler alınamadı: " + response.body());
            }
            JsonNode root = mapper.readTree(response.body());
            List<ReviewSupabase> listOfReviews = new ArrayList<>();

            if (root.isArray()) {
                for (JsonNode node : root) {
                    ReviewSupabase review = mapper.treeToValue(node, ReviewSupabase.class);
                    listOfReviews.add(review);
                }
            }

            return listOfReviews;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Değerlendirmeler alınırken hata oluştu: " + e.getMessage());
        }
    }

}
