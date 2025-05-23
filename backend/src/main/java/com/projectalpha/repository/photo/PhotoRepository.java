package com.projectalpha.repository.photo;

import com.projectalpha.dto.business.photo.PhotoDTO;
import java.util.List;

public interface PhotoRepository {
    List<PhotoDTO> findAll();
    PhotoDTO findById(String id);
    List<PhotoDTO> findByBusinessId(String businessId);
}