package com.projectalpha.dto.business.businessTag;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class BusinessTagDTO {
    @JsonProperty("id")
    private String id;

    @JsonProperty("business_id")
    private String businessId;

    @JsonProperty("tag_id")
    private String tagId;
}