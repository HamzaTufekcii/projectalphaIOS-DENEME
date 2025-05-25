package com.projectalpha.repository.business;

import com.projectalpha.dto.business.BusinessDTO;
import java.util.List;
import java.util.UUID;

/**
 * İş katmanı arayüzü: CRUD ve özel RPC benzeri metotlar burada tanımlı.
 */
public interface BusinessRepository {
    List<BusinessDTO> findAll();
    BusinessDTO findById(String id);
    List<BusinessDTO> findByNameContainingIgnoreCase(String name);
    List<BusinessDTO> findByOwnerId(Long ownerId);
    List<BusinessDTO> findTop5ByOrderByAvgRatingDesc();
    List<BusinessDTO> findWithActivePromotions();
    List<BusinessDTO> findByTag(UUID tagId);
}