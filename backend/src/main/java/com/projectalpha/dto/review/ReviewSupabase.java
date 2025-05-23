package com.projectalpha.dto.review;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.projectalpha.dto.business.BusinessSummaryDTO;
import lombok.Data;

import java.time.OffsetDateTime;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class ReviewSupabase {

    private String id;

    @JsonProperty("created_at")
    private String createdAt;

    private String comment;

    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("business_id")
    private String businessId;

    private int rating;

    @JsonProperty("review_photo_url")
    private String reviewPhotoUrl;

    private BusinessSummaryDTO business;
}
