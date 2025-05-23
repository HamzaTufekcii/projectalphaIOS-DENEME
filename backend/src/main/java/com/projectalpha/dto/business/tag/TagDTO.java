package com.projectalpha.dto.business.tag;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;


/**
 * DTO for Tag entity fetched from Supabase.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class TagDTO {
    private String id;
    private String name;
    private JsonNode icon; // veya uygun tip
}