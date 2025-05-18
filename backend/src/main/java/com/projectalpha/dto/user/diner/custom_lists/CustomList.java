package com.projectalpha.dto.user.diner.custom_lists;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.projectalpha.dto.user.diner.DinerUserProfile;
import com.projectalpha.dto.user.diner.custom_lists.listItem.CustomListItem;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class CustomList {

    private String id;
    private String name;
    private int likeCount;
    private boolean isPublic;
    private DinerUserProfile diner;

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class DinerUserProfile {
        private String user_id;
        private String user_profile_diner_id;
    }

}
