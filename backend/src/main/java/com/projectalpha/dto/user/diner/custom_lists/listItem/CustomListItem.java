package com.projectalpha.dto.user.diner.custom_lists.listItem;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.projectalpha.dto.business.BusinessDTO;
import com.projectalpha.dto.user.diner.DinerUserProfile;
import com.projectalpha.dto.user.diner.custom_lists.CustomList;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class CustomListItem {
    private String id;
    private String list_id;
    private String business_id;
    private String diner_id;
}
