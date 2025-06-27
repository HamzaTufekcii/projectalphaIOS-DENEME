package com.projectalpha.dto.business.operatingHour;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class OperatingHourDTO {
    private String id;

    @JsonProperty("weekday")
    private String day;

    @JsonProperty("opening_time")
    private String openingTime;

    @JsonProperty("o_c")
    private Boolean isClosed;

    @JsonProperty("closing_time")
    private String closingTime;

    private String business_id;
}
