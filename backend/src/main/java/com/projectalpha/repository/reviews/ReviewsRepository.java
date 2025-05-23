package com.projectalpha.repository.reviews;


import com.projectalpha.dto.review.ReviewInfoForBusiness;
import com.projectalpha.dto.review.ReviewSupabase;
import com.projectalpha.dto.review.newReviewRequest;

import java.util.List;
import java.util.Optional;

public interface ReviewsRepository {

    List<ReviewSupabase> getReviewByUserId(String userId);

    void saveReview(String userId, String businessId, newReviewRequest review);

    void deleteReview(String reviewId);

    List<ReviewSupabase> getReviewsByBusinessId(String businessId);



}
