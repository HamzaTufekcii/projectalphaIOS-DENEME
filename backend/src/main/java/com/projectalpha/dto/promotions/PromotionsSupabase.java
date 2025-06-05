package com.projectalpha.dto.promotions;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class PromotionsSupabase {

    private String id;

    private String title;

    private String description;

    @JsonProperty("startat")
    private String startDate;

    @JsonProperty("endat")
    private String endDate;

    private String business_id;

    private Boolean active;

    private int amount;

}
