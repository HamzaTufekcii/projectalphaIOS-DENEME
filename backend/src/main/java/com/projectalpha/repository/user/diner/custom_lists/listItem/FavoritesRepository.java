package com.projectalpha.repository.user.diner.custom_lists.listItem;

import com.projectalpha.dto.user.diner.custom_lists.CustomList;
import com.projectalpha.dto.user.diner.custom_lists.listItem.CustomListItem;
import com.projectalpha.dto.user.diner.custom_lists.listItem.CustomListItemRequest;

import java.util.List;

public interface FavoritesRepository {
    /**
     * Find diners' lists by their user_id (in database)
     * getDinerFavorites(@PathVariable String userId)
     * @param userId The dinerId to search for
     * @return The diner's lists
     */
    List<CustomList> getDinerFavorites(String userId);
    /**
     * Find diners' lists by their user_id (in database)
     * removeDinerFavoriteItem(@PathVariable String userId, @PathVariable String listItemId)
     * @param userId The dinerId to search for
     * @param listItemId The listItemId to remove for
     */
    void removeDinerFavoriteItem(String userId, String listItemId);
    /**
     * Create new favorite item
     * createDinerFavoriteItem(@PathVariable String userId, @RequestBody CustomListItemRequest createRequest)
     * @param userId The dinerId to search for
     * @param createRequest to get info from frontend
     */
    void createFavoriteItem(String userId, CustomListItemRequest createRequest);

    /**
     * Add selected item to selected list
     * addDinerFavoriteItem(@PathVariable String userId, @PathVariable String listItemId, @PathVariable String listId)
     * @param userId The dinerId to search for
     * @param listItemId the listItemId to search for
     * @param listId the listId to add listItem
     */
    void addDinerFavoriteItem(String userId, String listItemId, String listId);
}
