package com.projectalpha.dto.promotions;

import lombok.Data;

@Data
public class newPromotionRequest {

    private String title;

    private String description;

    private String startDate;

    private String endDate;

    private int amount;

    private Boolean isActive;

}
