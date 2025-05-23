// src/main/java/com/projectalpha/dto/business/BusinessSummaryDTO.java
package com.projectalpha.dto.business;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.projectalpha.dto.business.photo.PhotoDTO;
import lombok.Data;

import java.util.List;

/**
 * Gömülü olarak review içinde dönecek, işletmenin
 * - avgRating (ortalama puanı)
 * - description (işletme tipi)
 * - photos (fotoğraf URL’leri)
 * bilgilerini tutan küçük DTO.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class BusinessSummaryDTO {

    private String name;
    @JsonProperty("avg_rating")
    private Double avgRating;

    private String description;

    @JsonProperty("photo")
    private List<PhotoDTO> photos;
}
