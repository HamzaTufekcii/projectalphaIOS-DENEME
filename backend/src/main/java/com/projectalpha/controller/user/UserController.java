package com.projectalpha.controller.user;

import com.projectalpha.controller.user.diner.DinerController;
import com.projectalpha.controller.user.owner.OwnerController;
import com.projectalpha.dto.user.diner.DinerUpdateRequest;
import com.projectalpha.dto.user.diner.DinerUserProfile;
import com.projectalpha.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @GetMapping("/diner_user/{userId}/profile")
    public ResponseEntity<?> getDinerProfile(@PathVariable(name = "userId", required = false) String userId) {
        System.out.println(userId);
        return userService.getDinerProfileByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    @PutMapping("/diner_user/{userId}/profile")
    public ResponseEntity<?> updateDinerProfile(@PathVariable(name = "userId", required = false) String userId,
                                                @RequestBody DinerUpdateRequest request) {
        System.out.println(userId);
        userService.updateProfile(userId, request);
        return ResponseEntity.ok().build();
    }

    @Override
    @GetMapping("/diner_user/{userId}/lists")
    public ResponseEntity<?> getDinerLists(@PathVariable String userId) {
        // DinerService'de list fonksiyonu yok, o yüzden 501 dönüyoruz
        return ResponseEntity.status(501).body("getDinerLists() not implemented yet");
    }

    @Override
    @PostMapping("/diner_user/{userId}/lists")
    public ResponseEntity<?> createDinerList(@PathVariable String userId,
                                             @RequestBody Object body) {
        // DinerService'de list oluşturma yok, 501 dönüyoruz
        return ResponseEntity.status(501).body("createDinerList() not implemented yet");
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