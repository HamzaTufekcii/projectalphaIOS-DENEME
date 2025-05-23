package com.projectalpha.dto.business.restaurantsettings;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

/**
 * DTO for restaurant settings fetched from Supabase.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class RestaurantSettingsDTO {

    private String id;
    private String business_id;
    private boolean petFriendly;
    private boolean outdoor;
    private boolean vegan;
    private boolean parking;
    private boolean smoking;
    private boolean selfService;
    private boolean wifi;
}
