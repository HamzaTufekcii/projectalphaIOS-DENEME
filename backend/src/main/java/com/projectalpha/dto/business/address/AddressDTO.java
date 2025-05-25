package com.projectalpha.dto.business.address;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class AddressDTO {

    private String id;

    private String street;

    private String city;

    private String district;

    private String neighborhood;

    private String business_id;
}
