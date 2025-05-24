package com.projectalpha.dto.user.diner.custom_lists;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PublicList {
    private String user_id;
    @JsonProperty("user_profile_diner_id")
    private String user_profile_diner_id;
    private String id;
    private String name;
    @JsonProperty("like_counter")
    private int likeCount;
    @JsonProperty("is_public")
    private boolean isPublic;
    private String diner_name;
}
