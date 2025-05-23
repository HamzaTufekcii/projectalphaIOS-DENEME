package com.projectalpha.repository.businessTag;

import com.projectalpha.dto.business.businessTag.BusinessTagDTO;
import java.util.List;

public interface BusinessTagRepository {
    List<BusinessTagDTO> findAll();
    BusinessTagDTO findById(String id);
    List<BusinessTagDTO> findByBusinessId(String businessId);
    List<BusinessTagDTO> findByTagId(String tagId);
}