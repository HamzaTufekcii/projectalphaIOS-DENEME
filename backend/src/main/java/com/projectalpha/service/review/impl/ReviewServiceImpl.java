package com.projectalpha.service.review.impl;


import com.projectalpha.dto.review.ReviewInfoForBusiness;
import com.projectalpha.dto.review.ReviewSupabase;
import com.projectalpha.dto.review.newReviewRequest;
import com.projectalpha.dto.user.diner.custom_lists.PublicList;
import com.projectalpha.repository.reviews.ReviewsRepository;
import com.projectalpha.repository.user.diner.DinerRepository;
import com.projectalpha.service.review.ReviewService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewsRepository repo;
    private final DinerRepository dinerRepository;

    public ReviewServiceImpl(ReviewsRepository repo, DinerRepository dinerRepository) {
        this.repo = repo;
        this.dinerRepository = dinerRepository;
    }


    public List<ReviewSupabase> getReviewsByUserId(String userId){ return repo.getReviewsByUserId(userId); }

    public void saveReview(String userId, String businessId, newReviewRequest review){
        String dinerId = dinerRepository.findDinerId(userId);
        repo.saveReview(dinerId,businessId,review);
    }

    public void deleteReview(String reviewId){repo.deleteReview(reviewId);}

    public List<ReviewSupabase> getReviewsByBusinessId(String businessId){return repo.getReviewsByBusinessId(businessId);}

    public List<ReviewInfoForBusiness> getReviewsForBusiness(String businessId){
        List<ReviewSupabase> reviews = repo.getReviewsByBusinessId(businessId);
        List<ReviewInfoForBusiness> responseInfo = new ArrayList<>();

        for (ReviewSupabase review : reviews) {
            String dinerId = review.getUserId();

            ReviewInfoForBusiness reviewInfos = new ReviewInfoForBusiness(review); // burada yeni nesne yarat
            reviewInfos.setReviewerName(dinerRepository.findDinerNameSurname(dinerId));

            responseInfo.add(reviewInfos);
        }
        return responseInfo;
    }
}

