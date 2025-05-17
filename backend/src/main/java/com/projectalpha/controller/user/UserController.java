package com.projectalpha.controller.user;

import com.projectalpha.controller.user.diner.DinerController;
import com.projectalpha.controller.user.owner.OwnerController;
import com.projectalpha.dto.user.diner.DinerUserProfile;
import com.projectalpha.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.projectalpha.dto.user.owner.OwnerUserProfile;

@RestController
@RequestMapping("/api/users")
public class UserController implements DinerController, OwnerController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // -------- Diner Implementation --------
    @Override
    @GetMapping("/diner/{userId}/profile")
    public ResponseEntity<?> getDinerProfile(@PathVariable String userId) {
        return userService.getDinerProfileByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    @PutMapping("/diner/{userId}/profile")
    public ResponseEntity<?> updateDinerProfile(@PathVariable String userId,
                                                @RequestBody DinerUserProfile profile) {
        userService.updateProfile(userId, profile);
        return ResponseEntity.ok().build();
    }

    @Override
    @GetMapping("/diner/{userId}/lists")
    public ResponseEntity<?> getDinerLists(@PathVariable String userId) {
        // DinerService'de list fonksiyonu yok, o yüzden 501 dönüyoruz
        return ResponseEntity.status(501).body("getDinerLists() not implemented yet");
    }

    @Override
    @PostMapping("/diner/{userId}/lists")
    public ResponseEntity<?> createDinerList(@PathVariable String userId,
                                             @RequestBody Object body) {
        // DinerService'de list oluşturma yok, 501 dönüyoruz
        return ResponseEntity.status(501).body("createDinerList() not implemented yet");
    }

    // -------- Owner Implementation --------
    @Override
    @GetMapping("/owner/{userId}/profile")
    public ResponseEntity<?> getOwnerProfile(@PathVariable String userId) {
        return userService.getOwnerProfileByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    @PutMapping("/owner/{userId}/profile")
    public ResponseEntity<?> updateOwnerProfile(@PathVariable String userId,
                                                @RequestBody OwnerUserProfile profile) {
        userService.updateProfile(userId, profile);
        return ResponseEntity.ok().build();
    }
}



///**
// * Controller interface for handling users
// */
//@RestController
//@RequestMapping("/api/users")
//public class UserController implements OwnerController, DinerController {
//    private final UserService userService;
//
//    @Autowired
//    public UserController(UserService userService) {
//        this.userService = userService;
//    }
//
//    /**
//     * Get user user data
//     *
//     * @param userId The ID of the user
//     * @return User user information
//     */
//    @GetMapping("/{userId}/profile")
//    public ResponseEntity<?> getUserProfile(@RequestParam String userId) {
//        DinerUserProfile profile = dinerService.getProfileByUserId(userId);
//        if (profile != null) {
//            return ResponseEntity.ok(profile);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    /**
//     * Update user user information
//     *
//     * @param userId The ID of the user
//     * @param profileData The updated user data
//     * @return Success or error response
//     */
//    @PutMapping("/{userId}/profile")
//    public ResponseEntity<GenericResponse> updateUserProfile(
//            @PathVariable String userId,
//            @RequestBody UserProfileDTO profileData) {
//        try {
//            userService.updateUserProfile(userId, profileData);
//            return ResponseEntity.ok(new GenericResponse<>(true, "Profile updated successfully"));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body(new GenericResponse<>(false, "Error updating user: " + e.getMessage()));
//        }
//    }
//
//    /**
//     * Get all lists for a user (including favorites)
//     *
//     * @param userId The ID of the user
//     * @return List of user's lists
//     */
//    @GetMapping("/{userId}/lists")
//    public ResponseEntity<?> getUserLists(@PathVariable String userId) {
//        try {
//            List<ListDTO> lists = userService.getUserLists(userId);
//            return ResponseEntity.ok(lists);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body(new GenericResponse<>(false, "Error retrieving user lists: " + e.getMessage()));
//        }
//    }
//
//    /**
//     * Create a new list for a user
//     *
//     * @param userId The ID of the user
//     * @param listData The list data including name
//     * @return The created list
//     */
//    @PostMapping("/{userId}/lists")
//    public ResponseEntity<?> createList(
//            @PathVariable String userId,
//            @RequestBody Map<String, String> listData) {
//        try {
//            String listName = listData.get("name");
//            if (listName == null || listName.isEmpty()) {
//                return ResponseEntity.badRequest()
//                    .body(new GenericResponse<>(false, "List name is required"));
//            }
//
//            ListDTO newList = userService.createList(userId, listName);
//            return ResponseEntity.status(HttpStatus.CREATED).body(newList);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body(new GenericResponse<>(false, "Error creating list: " + e.getMessage()));
//        }
//    }
//
//    /**
//     * Add a business to a user's list
//     *
//     * @param userId The ID of the user
//     * @param listId The ID of the list
//     * @param requestBody The business ID to add
//     * @return Success or error response
//     */
//    @PostMapping("/{userId}/lists/{listId}/businesses")
//    public ResponseEntity<GenericResponse> addBusinessToList(
//            @PathVariable String userId,
//            @PathVariable String listId,
//            @RequestBody Map<String, String> requestBody) {
//        try {
//            String businessId = requestBody.get("businessId");
//            if (businessId == null || businessId.isEmpty()) {
//                return ResponseEntity.badRequest()
//                    .body(new GenericResponse<>(false, "Business ID is required"));
//            }
//
//            userService.addBusinessToList(userId, listId, businessId);
//            return ResponseEntity.ok(new GenericResponse<>(true, "Business added to list successfully"));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body(new GenericResponse<>(false, "Error adding business to list: " + e.getMessage()));
//        }
//    }
//
//    /**
//     * Remove a business from a user's list
//     *
//     * @param userId The ID of the user
//     * @param listId The ID of the list
//     * @param businessId The ID of the business to remove
//     * @return Success or error response
//     */
//    @DeleteMapping("/{userId}/lists/{listId}/businesses/{businessId}")
//    public ResponseEntity<GenericResponse> removeBusinessFromList(
//            @PathVariable String userId,
//            @PathVariable String listId,
//            @PathVariable String businessId) {
//        try {
//            userService.removeBusinessFromList(userId, listId, businessId);
//            return ResponseEntity.ok(new GenericResponse<>(true, "Business removed from list successfully"));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body(new GenericResponse<>(false, "Error removing business from list: " + e.getMessage()));
//        }
//    }
//
//    /**
//     * Get user's reviews
//     *
//     * @param userId The ID of the user
//     * @return List of user's reviews
//     */
//    @GetMapping("/{userId}/reviews")
//    public ResponseEntity<?> getUserReviews(@PathVariable String userId) {
//        try {
//            return ResponseEntity.ok(userService.getUserReviews(userId));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body(new GenericResponse<>(false, "Error retrieving user reviews: " + e.getMessage()));
//        }
//    }
//}