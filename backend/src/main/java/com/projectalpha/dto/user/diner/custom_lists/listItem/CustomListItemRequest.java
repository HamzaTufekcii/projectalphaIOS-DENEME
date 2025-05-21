package com.projectalpha.dto.user.diner.custom_lists.listItem;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class CustomListItemRequest {
    @JsonProperty("list_id")
    String list_id;
    String listItemId;

}
