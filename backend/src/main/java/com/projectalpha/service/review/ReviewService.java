package com.projectalpha.service.review;

import com.projectalpha.dto.review.ReviewInfoForBusiness;
import com.projectalpha.dto.review.ReviewSupabase;
import com.projectalpha.dto.review.newReviewRequest;

import java.util.List;

public interface ReviewService {

    List<ReviewSupabase> getReviewsByUserId(String userId);

    void saveReview(String userId, String businessId, newReviewRequest review);

    void deleteReview(String reviewId);

    List<ReviewSupabase> getReviewsByBusinessId(String businessId);

    List<ReviewInfoForBusiness> getReviewsForBusiness(String businessId);

}
