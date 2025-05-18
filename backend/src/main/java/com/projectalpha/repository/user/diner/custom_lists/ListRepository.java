package com.projectalpha.repository.user.diner.custom_lists;

import com.projectalpha.dto.business.BusinessDTO;
import com.projectalpha.dto.user.diner.custom_lists.CustomList;
import com.projectalpha.dto.user.diner.custom_lists.CustomListRequest;

import java.util.List;

public interface ListRepository {

    /**
     * Find diners' lists by their user_id (in database)
     * getDinerLists(@PathVariable String userId)
     * @param userId The dinerId to search for
     * @return The diner's lists
     */
    List<CustomList> getDinerLists(String userId);
    /**
     * Find diners' lists by their user_id (in database)
     * getDinerListItems(@PathVariable String userId)
     * @param userId The dinerId to search for
     * @return The diner's lists
     */
    List<BusinessDTO> getDinerListItems(String userId, String listItemId);

    /**
     * Let diners create a new list by their user_id (in database)
     * createDinerList(@PathVariable String userId, @RequestBody CustomListRequest createRequest)
     * @param userId The userId to search for
     * @param createRequest the new list's infos from frontend
     * @return The new list
     */
    CustomList createList(String userId, CustomListRequest createRequest);

    /**
     * Let diners update a new list by their user_id and theirs listId's (in database)
     * updateDinerList(@PathVariable String userId, @PathVariable String listId, @RequestBody CustomListRequest updateRequest)
     * @param userId The userId to search for
     * @param listId The listId to search for
     * @param updateRequest the list's new infos from frontend
     */
    void updateDinerList(String userId, String listId, CustomListRequest updateRequest);

    /**
     * Let diners remove a list by their user_id and theirs listId's (in database)
     * removeDinerList(@PathVariable String userId, @PathVariable String listId)
     * @param userId The userId to search for
     * @param listId The listId to search and remove for
     */
    void removeDinerList(String userId, String listId);
}
