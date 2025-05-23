package com.projectalpha.repository.restaurantSettings;

import com.projectalpha.dto.business.restaurantsettings.RestaurantSettingsDTO;
import java.util.List;

public interface RestaurantSettingsRepository {
    List<RestaurantSettingsDTO> findAll();
    RestaurantSettingsDTO findById(String id);
    RestaurantSettingsDTO findByBusinessId(String businessId);
}