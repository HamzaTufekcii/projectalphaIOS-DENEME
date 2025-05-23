package com.projectalpha.dto.user.diner;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.projectalpha.dto.review.ReviewSupabase;
import lombok.Data;

import java.util.List;
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class DinerLoginResponse {

    private final DinerUserProfile profile;
    private final List<ReviewSupabase> dinerReviews;

    public DinerLoginResponse(DinerUserProfile dinerProfile, List<ReviewSupabase> dinerReviews) {
        this.profile = dinerProfile;
        this.dinerReviews = dinerReviews;
    }


}
