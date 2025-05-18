package com.projectalpha.controller.user;

import com.projectalpha.controller.user.diner.DinerController;
import com.projectalpha.controller.user.diner.favorite.FavoritesController;
import com.projectalpha.controller.user.diner.list.ListsController;
import com.projectalpha.controller.user.owner.OwnerController;
import com.projectalpha.dto.user.diner.DinerUpdateRequest;
import com.projectalpha.dto.user.diner.custom_lists.CustomListRequest;
import com.projectalpha.dto.user.diner.custom_lists.listItem.CustomListItemRequest;
import com.projectalpha.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.projectalpha.dto.user.owner.OwnerUserProfile;

@RestController
@RequestMapping("/api/users")
public class UserController implements DinerController, OwnerController, ListsController, FavoritesController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // -------- Diner Implementation --------
    @Override
    @GetMapping("/diner_user/{userId}/profile")
    public ResponseEntity<?> getDinerProfile(@PathVariable(name = "userId") String userId) {
        return userService.getDinerProfileByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    @PutMapping("/diner_user/{userId}/profile")
    public ResponseEntity<?> updateDinerProfile(@PathVariable(name = "userId") String userId,
                                                @RequestBody DinerUpdateRequest request) {
        userService.updateProfile(userId, request);
        return ResponseEntity.ok().build();
    }

    // ---- DinerList Implementations ----

    @Override
    @GetMapping("/diner_user/{userId}/lists")
    public ResponseEntity<?> getDinerLists(@PathVariable(name = "userId") String userId) {
        // DinerService'de list fonksiyonu yok, o yüzden 501 dönüyoruz
        return ResponseEntity.status(501).body("getDinerLists() not implemented yet");
    }

    @Override
    @PostMapping("/diner_user/{userId}/lists")
    public ResponseEntity<?> createDinerList(@PathVariable(name = "userId") String userId,
                                             @RequestBody CustomListRequest createRequest) {
        // DinerService'de list oluşturma yok, 501 dönüyoruz
        return ResponseEntity.status(501).body("createDinerList() not implemented yet");
    }
    @Override
    @PutMapping("diner_user/{userId}/lists/{listId}")
    public ResponseEntity<?> updateDinerList(@PathVariable(name = "userId") String userId,
                                             @PathVariable(name = "listId") String listId,
                                             @RequestBody CustomListRequest updateRequest){
        return ResponseEntity.status(501).body("updateDinerList() not implemented yet");
    }
    @Override
    @PatchMapping("/diner_user/{userId}/lists/{listId}")
    public ResponseEntity<?> removeDinerList(@PathVariable(name = "userId") String userId,
                                             @PathVariable(name = "listId") String listId) {
        return ResponseEntity.status(501).body("removeDinerList() not implemented");
    }
    //--- DinerFavorite implementations ---


    @Override
    @GetMapping("/diner_user/{userId}/favorites")
    public ResponseEntity<?> getDinerFavorites(@PathVariable(name = "userId") String userId) {
        return ResponseEntity.status(501).body("getDinerFavorites() not implemented");
    }
    @Override
    @PostMapping("/diner_user/{userId}/favorites")
    public ResponseEntity<?> createDinerFavoriteItem(@PathVariable(name = "userId") String userId, @RequestBody CustomListItemRequest createRequest){
        return ResponseEntity.status(501).body("createDinerFavoriteItem() not implemented");
    }
    @Override
    @PatchMapping("/diner_user/{userId}/favorites/{listItemId}")
    public ResponseEntity<?> removeDinerFavoriteItem(@PathVariable(name = "userId") String userId,
                                                     @PathVariable(name = "listItemId") String listItemId) {
        return ResponseEntity.status(501).body("removeDinerFavorite() not implemented");
    }
    @Override
    @PutMapping("/diner_user/{userId}/favorites/{listItemId}/add_to/{listId}")
    public ResponseEntity<?> addDinerFavoriteItem(@PathVariable String userId, @PathVariable String listItemId, @PathVariable String listId) {
        return ResponseEntity.status(501).body("addDinerFavoriteItem() not implemented");
    }


    // -------- Owner Implementation --------
    @Override
    @GetMapping("/owner_user/{userId}/profile")
    public ResponseEntity<?> getOwnerProfile(@PathVariable String userId) {
        return userService.getOwnerProfileByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    @PutMapping("/owner_user/{userId}/profile")
    public ResponseEntity<?> updateOwnerProfile(@PathVariable String userId,
                                                @RequestBody OwnerUserProfile profile) {
        userService.updateProfile(userId, profile);
        return ResponseEntity.ok().build();
    }
}