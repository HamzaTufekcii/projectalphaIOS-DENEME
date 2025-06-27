package com.projectalpha.repository.operatingHour;

import com.projectalpha.dto.business.operatingHour.OperatingHourDTO;

import java.util.List;

public interface OperatingHourRepository {
    List<OperatingHourDTO> getAllOperatingHours();
    List<OperatingHourDTO> getOperatingHoursByBusinessId(String businessId);
}
