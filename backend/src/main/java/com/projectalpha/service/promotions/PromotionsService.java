package com.projectalpha.service.promotions;

import com.projectalpha.dto.promotions.PromotionInfoForGeneral;
import com.projectalpha.dto.promotions.PromotionsSupabase;
import com.projectalpha.dto.promotions.newPromotionRequest;

import java.util.List;

public interface PromotionsService {

    PromotionsSupabase newPromotion(String businessId, newPromotionRequest request);

    void deletePromotion(String businessId, String promotionId);

    void updatePromotion(String businessId, String promotionId, newPromotionRequest request);

    PromotionInfoForGeneral getPromotionInfo(String businessId, String promotionId);

    List<PromotionsSupabase> getPromotions(String businessId);

}
