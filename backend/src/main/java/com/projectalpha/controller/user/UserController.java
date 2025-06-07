package com.projectalpha.controller.user;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectalpha.controller.user.diner.DinerController;
import com.projectalpha.controller.user.diner.list.ListsController;
import com.projectalpha.controller.user.owner.OwnerController;
import com.projectalpha.dto.GenericResponse;
import com.projectalpha.dto.business.Business;
import com.projectalpha.dto.business.BusinessDTO;
import com.projectalpha.dto.review.newReviewRequest;
import com.projectalpha.dto.user.diner.DinerUpdateRequest;
import com.projectalpha.dto.user.diner.custom_lists.CustomList;
import com.projectalpha.dto.user.diner.custom_lists.CustomListRequest;
import com.projectalpha.dto.user.diner.custom_lists.PublicList;
import com.projectalpha.dto.user.diner.custom_lists.listItem.CustomListItemRequest;
import com.projectalpha.dto.user.owner.OwnerUpdateRequest;
import com.projectalpha.service.review.ReviewService;
import com.projectalpha.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.projectalpha.dto.user.owner.OwnerUserProfile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController implements DinerController, OwnerController, ListsController {

    private final UserService userService;
    private final ReviewService reviewService;

    @Autowired
    public UserController(UserService userService, ReviewService reviewService) {
        this.userService = userService;
        this.reviewService = reviewService;
    }


    //------General User------\\
    @PatchMapping("/{userId}/change-password")
    public ResponseEntity<?>changePassword(@PathVariable(name = "userId") String userId,
                                           @RequestBody Map<String, String> body) throws Exception {
        String newPassword = body.get("newPassword");
        userService.changePassword(userId, newPassword);

        return ResponseEntity.ok().build();
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

    @Override
    @GetMapping("/diner_user/{userId}/reviews")
    public ResponseEntity<?> getDinerReviews(@PathVariable(name = "userId") String userId) {
        try {
            return ResponseEntity.ok(
                    new GenericResponse<>(true, "Reviews", userService.getDinerReviews(userId))
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new GenericResponse<>(false, "Invalid user ID"));
        }
    }
    @PostMapping("/diner_user/{userId}/reviews/{businessId}")
    public ResponseEntity<?> addDinerReview(@PathVariable(name = "userId") String userId,
                                            @PathVariable(name = "businessId") String businessId,
                                            @RequestBody newReviewRequest reviewRequest) {
        reviewService.saveReview(userId, businessId, reviewRequest);
        return ResponseEntity.ok().build();
    }

    // ---- DinerList Implementations ----

    @GetMapping("/diner_user/public/lists")
    public ResponseEntity<?> getPublicLists() {
        try {
            List<PublicList> lists = userService.getPublicLists();
            return ResponseEntity.ok(lists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Listeler alınamadı: " + e.getMessage());

        }

    }



    @Override
    @GetMapping("/diner_user/{userId}/lists")
    public ResponseEntity<?> getDinerLists(@PathVariable(name = "userId") String userId) {
        try {
            List<CustomList> lists = userService.getDinerLists(userId);
            return ResponseEntity.ok(lists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Listeler alınamadı: " + e.getMessage());

        }
    }

    @Override
    @PostMapping("/diner_user/{userId}/lists")
    public ResponseEntity<?> createDinerList(@PathVariable(name = "userId") String userId,
                                             @RequestBody CustomListRequest createRequest) {
        try {
            CustomList createdList = userService.createList(userId, createRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Liste oluşturulamadı: " + e.getMessage());
        }
    }
    @Override
    @PatchMapping ("diner_user/{userId}/lists/{listId}")
    public ResponseEntity<?> updateDinerList(@PathVariable(name = "userId") String userId,
                                             @PathVariable(name = "listId") String listId,
                                             @RequestBody CustomListRequest updateRequest){
        try {
            CustomList updatedList = userService.updateList(userId, listId, updateRequest);
            return ResponseEntity.ok(updatedList); // güncellenmiş liste dön
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Liste güncellenemedi: " + e.getMessage());
        }
    }
    @Override
    @DeleteMapping ("/diner_user/{userId}/lists/{listId}")
    public ResponseEntity<?> removeDinerList(@PathVariable(name = "userId") String userId,
                                             @PathVariable(name = "listId") String listId) {
        try {
            userService.removeDinerList(userId, listId);
            return ResponseEntity.ok("Liste başarıyla silindi.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Liste silinemedi: " + e.getMessage());
        }


    }
    //BURADASIN--- DinerFavorite implementations ---


    @Override
    @GetMapping("/diner_user/{userId}/lists/{listId}/items")
    public ResponseEntity<?> getDinerListItems(@PathVariable String userId,
                                               @PathVariable String listId) {

            try {
                List<BusinessDTO> items = userService.getDinerListItems(userId, listId);
                return ResponseEntity.ok(items);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Liste item'ları alınamadı: " + e.getMessage());
            }
    }


        @Override
        @PostMapping("/diner_user/{userId}/lists/{listId}/items/{businessId}")
        public ResponseEntity<?> createListItem(@PathVariable(name="userId") String userId,
                                                @PathVariable(name="listId") String listId,
                                                @PathVariable(name="businessId") String businessId) {
            try {
                String listItemId = userService.createListItem(userId, businessId, listId);
                return ResponseEntity.ok(Map.of("listItemId", listItemId));
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Hata: " + e.getMessage());
            }
        }

    @Override
    @DeleteMapping("/diner_user/{userId}/lists/{listId}/items/{listItemId}")
    public ResponseEntity<?> removeListItem(@PathVariable(name = "userId") String userId,
                                            @PathVariable(name = "listId") String listId,
                                            @PathVariable(name = "listItemId") String listItemId) {
        try {
            userService.removeListItem(userId, listId, listItemId);
            return ResponseEntity.ok("Liste'den item başarıyla silindi.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Liste'den item silinemedi: " + e.getMessage());
        }
    }
    @Override
    @PostMapping("/diner_user/{userId}/like/{listId}")
    public ResponseEntity<?> likeList(@PathVariable String userId,
                                      @PathVariable String listId) {
        try {
            String likeId = userService.likeList(userId,listId);
            return ResponseEntity.ok(Map.of("likeId", likeId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Hata: " + e.getMessage());
        }
    }
    @Override
    @DeleteMapping("/diner_user/{userId}/unlike/{listId}")
    public ResponseEntity<?> unLikeList(@PathVariable String userId,
                                        @PathVariable String listId) {
        try{
            userService.unLikeList(userId, listId);
            return ResponseEntity.ok("Liste başarıyla beğenilenlerden çıkarıldı.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Hata: " + e.getMessage());
        }
    }
    @GetMapping("/diner_user/{userId}/likes")
    public ResponseEntity<?> getLikedLists(@PathVariable String userId) {
        try {
            return ResponseEntity.ok(
                    new GenericResponse<>(true, "Likes", userService.getDinerLikes(userId))
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new GenericResponse<>(false, "Invalid user ID"));
        }
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
                                                @RequestBody OwnerUpdateRequest request) {
        userService.updateProfile(userId, request);
        return ResponseEntity.ok().build();
    }

}