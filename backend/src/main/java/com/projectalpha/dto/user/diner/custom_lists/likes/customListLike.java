package com.projectalpha.dto.user.diner.custom_lists.likes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class customListLike {
    private String id;
    @JsonProperty("list_id")
    private String listId;
    @JsonProperty("user_id")
    private String dinerId;
}
