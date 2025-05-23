package com.projectalpha.service.review.impl;


import com.projectalpha.dto.review.ReviewSupabase;
import com.projectalpha.dto.review.newReviewRequest;
import com.projectalpha.repository.reviews.ReviewsRepository;
import com.projectalpha.service.review.ReviewService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewsRepository repo;
    public ReviewServiceImpl(ReviewsRepository repo) {
        this.repo = repo;
    }


    public List<ReviewSupabase> getReviewByUserId(String userId){ return repo.getReviewByUserId(userId); }

    public void saveReview(String userId, String businessId, newReviewRequest review){repo.saveReview(userId,businessId,review);}

    public void deleteReview(String reviewId){repo.deleteReview(reviewId);}

    public List<ReviewSupabase> getReviewsByBusinessId(String businessId){return repo.getReviewsByBusinessId(businessId);}

}
