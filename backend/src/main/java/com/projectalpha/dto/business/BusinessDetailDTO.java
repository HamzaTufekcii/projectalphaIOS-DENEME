package com.projectalpha.dto.business;

import com.projectalpha.dto.business.address.AddressDTO;
import com.projectalpha.dto.business.photo.PhotoDTO;
import com.projectalpha.dto.business.restaurantsettings.RestaurantSettingsDTO;
import com.projectalpha.dto.business.tag.TagDTO;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Detailed DTO for Business, including related entities.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessDetailDTO {
    private String id;
    private String name;
    private String description;
    private String priceRange;
    private int avgRating;
    private String createdAt;

    private AddressDTO address;
    private List<TagDTO> tags;
    private List<PhotoDTO> photos;
    private RestaurantSettingsDTO settings;
}
