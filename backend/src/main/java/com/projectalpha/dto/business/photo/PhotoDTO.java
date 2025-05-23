package com.projectalpha.dto.business.photo;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

/**
 * DTO for Photo entity fetched from Supabase.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class PhotoDTO {
    private String id;
    private String url;
    private String caption;
    private boolean isCover;
}