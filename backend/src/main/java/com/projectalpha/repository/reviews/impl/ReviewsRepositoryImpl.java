package com.projectalpha.repository.reviews.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectalpha.config.thirdparty.SupabaseConfig;
import com.projectalpha.dto.review.ReviewSupabase;
import com.projectalpha.dto.review.newReviewRequest;
import com.projectalpha.repository.reviews.ReviewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class ReviewsRepositoryImpl implements ReviewsRepository {

    private final SupabaseConfig supabaseConfig;
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    public ReviewsRepositoryImpl(SupabaseConfig supabaseConfig) {this.supabaseConfig = supabaseConfig;}

    @Override
    public List<ReviewSupabase> getReviewsByUserId(String userId) {
        try {
            String url = supabaseConfig.getSupabaseUrl()
                    + "/rest/v1/review"
                    + "?select="
                    // review alanları
                    + "id,comment,rating,created_at,review_photo_url,user_id,business_id,"
                    // business ilişkisinin gömülmesi; tablo adı “photo”
                    + "business:business_id("
                    + "name,"
                    + "avg_rating,"
                    + "description,"
                    + "photo(id,url,caption,isCover)"
                    + ")"
                    // filtre ve sıralama
                    + "&user_id=eq." + userId
                    + "&order=created_at.desc";

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
            List<ReviewSupabase> reviews = new ArrayList<>();
            if (root.isArray()) {
                for (JsonNode node : root) {
                    reviews.add(mapper.treeToValue(node, ReviewSupabase.class));
                }
            }
            return reviews;
        } catch (Exception e) {
            throw new RuntimeException("Değerlendirmeler alınırken hata oluştu: " + e.getMessage(), e);
        }
    }

    public void saveReview(String dinerId, String businessId, newReviewRequest request) {
        try {
            Map<String, Object> reviewPayload = Map.of(
                    "comment", request.getComment(),
                    "rating", request.getRating(),
                    "created_at", OffsetDateTime.now().toString(),
                    "business_id", businessId,
                    "user_id", dinerId
            );

            String reviewsJson = mapper.writeValueAsString(reviewPayload);
            String url = supabaseConfig.getSupabaseUrl() + "/rest/v1/review";
            HttpRequest reviewRequest = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .POST(HttpRequest.BodyPublishers.ofString(reviewsJson))
                    .header("apikey", supabaseConfig.getSupabaseApiKey())
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseSecretKey())
                    .header("Content-Type", "application/json")
                    .header("Prefer", "return=representation")
                    .build();

            HttpResponse<String> response = httpClient.send(reviewRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 201 && response.statusCode() != 200) {
                throw new RuntimeException("Review kaydedilemedi: " + response.body());
            }

            System.out.println("Review başarıyla oluşturuldu: " + response.body());

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
