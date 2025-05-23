package com.projectalpha.dto.review;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.projectalpha.dto.user.diner.DinerUserProfile;
import lombok.Data;
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class ReviewInfoForBusiness {
    private final ReviewSupabase review;
    private final DinerUserProfile reviewer;

    public ReviewInfoForBusiness(ReviewSupabase review, DinerUserProfile reviewer) {
        this.review = review;
        this.reviewer = reviewer;
    }
}
