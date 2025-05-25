package com.projectalpha.repository.tag;

import com.projectalpha.dto.business.tag.TagDTO;
import java.util.List;

public interface TagRepository {
    List<TagDTO> findAll();
    TagDTO findById(String id);
    List<TagDTO> findByNameContainingIgnoreCase(String name);
}