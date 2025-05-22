package com.projectalpha.service.business.impl;

import com.projectalpha.dto.business.BusinessDTO;
import com.projectalpha.repository.business.BusinessRepository;
import com.projectalpha.service.business.BusinessService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class BusinessServiceImpl implements BusinessService {

    private final BusinessRepository repo;

    public BusinessServiceImpl(BusinessRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<BusinessDTO> getAllBusinesses() {
        return repo.findAll();
    }

    @Override
    public BusinessDTO getBusinessById(String id) {
        BusinessDTO dto = repo.findById(id);
        if (dto == null) throw new NoSuchElementException("Not found: " + id);
        return dto;
    }

    @Override
    public List<BusinessDTO> searchByName(String name) {
        return repo.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<BusinessDTO> getByOwnerId(Long ownerId) {
        return repo.findByOwnerId(ownerId);
    }

    @Override
    public List<BusinessDTO> getTopRated(int limit) {
        return repo.findTop5ByOrderByAvgRatingDesc().stream().limit(limit).toList();
    }

    @Override
    public List<BusinessDTO> getWithActivePromotions() {
        return repo.findWithActivePromotions();
    }

    @Override
    public List<BusinessDTO> getByTag(UUID tagId) {
        return repo.findByTag(tagId);
    }
}