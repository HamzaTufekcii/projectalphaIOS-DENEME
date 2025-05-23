package com.projectalpha.dto.review;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.time.OffsetDateTime;
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class newReviewRequest {

    private String comment;

    private int rating;

    private OffsetDateTime createdAt;

}
