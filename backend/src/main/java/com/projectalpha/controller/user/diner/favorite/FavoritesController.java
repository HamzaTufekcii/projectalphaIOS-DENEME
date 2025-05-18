package com.projectalpha.controller.user.diner.favorite;

import com.projectalpha.dto.user.diner.custom_lists.listItem.CustomListItemRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

public interface FavoritesController {
    ResponseEntity<?> getDinerFavorites(@PathVariable String userId);
    ResponseEntity<?> removeDinerFavoriteItem(@PathVariable String userId, @PathVariable String listItemId);
    ResponseEntity<?> createDinerFavoriteItem(@PathVariable String userId, @RequestBody CustomListItemRequest createRequest);
    ResponseEntity<?> addDinerFavoriteItem(@PathVariable String userId, @PathVariable String listItemId, @PathVariable String listId);

//    ResponseEntity<?> getDinerFavorites(@PathVariable String userId);
//    ResponseEntity<?> removeDinerFavoriteItem(@PathVariable String userId, @PathVariable String listItemId);
//    ResponseEntity<?> createDinerFavoriteItem(@PathVariable String userId, @RequestBody CustomListItemRequest createRequest);
//    ResponseEntity<?> addDinerFavoriteItem(@PathVariable String userId, @PathVariable String listItemId, @PathVariable String listId);
}
