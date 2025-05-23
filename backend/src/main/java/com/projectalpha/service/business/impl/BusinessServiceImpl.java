package com.projectalpha.service.business.impl;

import com.projectalpha.dto.business.BusinessDetailDTO;
import com.projectalpha.dto.business.BusinessDTO;
import com.projectalpha.dto.business.address.AddressDTO;
import com.projectalpha.dto.business.businessTag.BusinessTagDTO;
import com.projectalpha.dto.business.photo.PhotoDTO;
import com.projectalpha.dto.business.restaurantsettings.RestaurantSettingsDTO;
import com.projectalpha.dto.business.tag.TagDTO;
import com.projectalpha.service.business.BusinessService;
import com.projectalpha.repository.business.BusinessRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BusinessServiceImpl implements BusinessService {

    private final BusinessRepository businessRepo;
    private final com.projectalpha.repository.address.AddressRepository addressRepo;
    private final com.projectalpha.repository.businessTag.BusinessTagRepository businessTagRepo;
    private final com.projectalpha.repository.tag.TagRepository tagRepo;
    private final com.projectalpha.repository.photo.PhotoRepository photoRepo;
    private final com.projectalpha.repository.restaurantSettings.RestaurantSettingsRepository settingsRepo;

    public BusinessServiceImpl(
            BusinessRepository businessRepo,
            com.projectalpha.repository.address.AddressRepository addressRepo,
            com.projectalpha.repository.businessTag.BusinessTagRepository businessTagRepo,
            com.projectalpha.repository.tag.TagRepository tagRepo,
            com.projectalpha.repository.photo.PhotoRepository photoRepo,
            com.projectalpha.repository.restaurantSettings.RestaurantSettingsRepository settingsRepo
    ) {
        this.businessRepo = businessRepo;
        this.addressRepo = addressRepo;
        this.businessTagRepo = businessTagRepo;
        this.tagRepo = tagRepo;
        this.photoRepo = photoRepo;
        this.settingsRepo = settingsRepo;
    }

    @Override
    public List<BusinessDetailDTO> getAllBusinessDetails() {
        return businessRepo.findAll()
                .stream()
                .map(BusinessDTO::getId)
                .map(this::getBusinessDetails)
                .collect(Collectors.toList());
    }

    @Override
    public BusinessDetailDTO getBusinessDetails(String id) {
        BusinessDTO basic = businessRepo.findById(id);
        if (basic == null) throw new NoSuchElementException("Business not found: " + id);

        // Fetch related entities
        AddressDTO address = addressRepo.findByBusinessId(id);
        List<BusinessTagDTO> bTags = businessTagRepo.findByBusinessId(id);
        List<TagDTO> tags = bTags.stream()
                .map(bt -> tagRepo.findById(bt.getTagId().toString()))
                .collect(Collectors.toList());
        List<PhotoDTO> photos = photoRepo.findByBusinessId(id);
        RestaurantSettingsDTO settings = settingsRepo.findByBusinessId(id);

        // Map and convert types appropriately
        return BusinessDetailDTO.builder()
                .id(basic.getId())
                .name(basic.getName())
                .description(basic.getDescription())
                .priceRange(basic.getPrice_range())        // use getPriceRange()
                .avgRating(basic.getAvg_rating())         // use getAvgRating()
                .createdAt(basic.getCreated_at())         // use getCreatedAt()
                .address(address)
                .tags(tags)
                .photos(photos)
                .settings(settings)
                .build();
    }

    @Override
    public List<BusinessDetailDTO> searchByName(String name) {
        return businessRepo.findByNameContainingIgnoreCase(name)
                .stream()
                .map(BusinessDTO::getId)
                .map(this::getBusinessDetails)
                .collect(Collectors.toList());
    }

    @Override
    public List<BusinessDetailDTO> getByOwnerId(Long ownerId) {
        return businessRepo.findByOwnerId(ownerId)
                .stream()
                .map(BusinessDTO::getId)
                .map(this::getBusinessDetails)
                .collect(Collectors.toList());
    }

    @Override
    public List<BusinessDetailDTO> getTopRated(int limit) {
        return businessRepo.findTop5ByOrderByAvgRatingDesc()
                .stream()
                .map(BusinessDTO::getId)
                .map(this::getBusinessDetails)
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<BusinessDetailDTO> getWithActivePromotions() {
        return businessRepo.findWithActivePromotions()
                .stream()
                .map(BusinessDTO::getId)
                .map(this::getBusinessDetails)
                .collect(Collectors.toList());
    }

    @Override
    public List<BusinessDetailDTO> getByTag(UUID tagId) {
        return businessRepo.findByTag(tagId)
                .stream()
                .map(BusinessDTO::getId)
                .map(this::getBusinessDetails)
                .collect(Collectors.toList());
    }
}