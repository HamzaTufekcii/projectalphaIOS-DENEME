package com.projectalpha.service.business;

import com.projectalpha.dto.business.BusinessDetailDTO;
import java.util.List;
import java.util.UUID;

/**
 * Service interface returning detailed business information for all operations.
 */
public interface BusinessService {

    /** Get detailed information for all businesses. */
    List<BusinessDetailDTO> getAllBusinessDetails();

    /** Get detailed information for a business by ID. */
    BusinessDetailDTO getBusinessDetails(String id);

    /** Search businesses by name and return detailed DTOs. */
    List<BusinessDetailDTO> searchByName(String name);

    /** Get businesses by owner ID with detailed DTOs. */
    List<BusinessDetailDTO> getByOwnerId(Long ownerId);

    /** Get top rated businesses, limited, with detailed DTOs. */
    List<BusinessDetailDTO> getTopRated(int limit);

    /** Get businesses with active promotions, detailed. */
    List<BusinessDetailDTO> getWithActivePromotions();

    /** Get businesses by tag ID, detailed. */
    List<BusinessDetailDTO> getByTag(UUID tagId);
}