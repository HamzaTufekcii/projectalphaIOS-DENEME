package com.projectalpha.service.business;

import com.projectalpha.dto.business.BusinessDTO;
import java.util.List;

/**
 * Service interface for business-related operations, returning DTOs.
 */
public interface BusinessService {

    /** Get all businesses. */
    List<BusinessDTO> getAllBusinesses();

    /** Get business by ID. */
    BusinessDTO getBusinessById(String id);

    /** Search businesses by name. */
    List<BusinessDTO> searchByName(String name);

    /** Get businesses by owner ID. */
    List<BusinessDTO> getByOwnerId(Long ownerId);

    /** Get top rated businesses. */
    List<BusinessDTO> getTopRated(int limit);

    /** Get businesses with active promotions. */
    List<BusinessDTO> getWithActivePromotions();

    /** Get businesses by tag ID. */
    List<BusinessDTO> getByTag(java.util.UUID tagId);
}