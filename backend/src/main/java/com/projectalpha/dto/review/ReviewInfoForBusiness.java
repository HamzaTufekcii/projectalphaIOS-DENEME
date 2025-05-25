package com.projectalpha.dto.review;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.projectalpha.dto.user.diner.DinerUserProfile;
import lombok.Data;
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class ReviewInfoForBusiness {
    com.projectalpha.dto.review.ReviewSupabase review;
    private String reviewerName;

    public ReviewInfoForBusiness(com.projectalpha.dto.review.ReviewSupabase reviewSupabase) {
        this.review = reviewSupabase;
    }
}
