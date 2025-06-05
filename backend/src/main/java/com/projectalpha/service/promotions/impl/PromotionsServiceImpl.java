package com.projectalpha.service.promotions.impl;

import com.projectalpha.dto.promotions.PromotionInfoForGeneral;
import com.projectalpha.dto.promotions.PromotionsSupabase;
import com.projectalpha.dto.promotions.newPromotionRequest;
import com.projectalpha.repository.promotions.PromotionsRepository;
import com.projectalpha.service.promotions.PromotionsService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromotionsServiceImpl implements PromotionsService {
    private final PromotionsRepository repo;

    public PromotionsServiceImpl(PromotionsRepository repo) {
        this.repo = repo;
    }

    @Override
    public void deletePromotion(String businessId, String promotionId) {
        repo.deletePromotion(businessId, promotionId);
    }

    @Override
    public PromotionsSupabase newPromotion(String businessId, newPromotionRequest request) {
        return repo.newPromotion(businessId, request);
    }
    @Override
    public void updatePromotion(String businessId, String promotionId, newPromotionRequest request) {
        repo.updatePromotion(businessId, promotionId, request);
    }

    @Override
    public List<PromotionsSupabase> getPromotions(String businessId) {
        return repo.getPromotions(businessId);
    }

    @Override
    public PromotionInfoForGeneral getPromotionInfo(String businessId, String promotionId) {
        return null;
    }
}
