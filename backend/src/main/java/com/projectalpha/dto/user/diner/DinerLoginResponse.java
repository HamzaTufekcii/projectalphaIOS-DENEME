package com.projectalpha.dto.user.diner;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.projectalpha.dto.review.ReviewSupabase;
import com.projectalpha.dto.user.diner.custom_lists.CustomList;
import lombok.Data;

import java.util.List;
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class DinerLoginResponse {

    private final DinerUserProfile profile;
    private final List<CustomList> dinerLists;

    public DinerLoginResponse(DinerUserProfile dinerProfile, List<CustomList> dinerLists) {
        this.profile = dinerProfile;
        this.dinerLists = dinerLists;
    }


}
