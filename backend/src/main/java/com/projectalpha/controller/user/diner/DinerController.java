package com.projectalpha.controller.user.diner;

import com.projectalpha.dto.user.diner.DinerUserProfile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface DinerController {

    @GetMapping("/{userId}/profile")
    ResponseEntity<?> getDinerProfile(@PathVariable String userId);

    @PutMapping("/{userId}/profile")
    ResponseEntity<?> updateDinerProfile(@PathVariable String userId, @RequestBody DinerUserProfile profile);

    @GetMapping("/{userId}/lists")
    ResponseEntity<?> getDinerLists(@PathVariable String userId);

    @PostMapping("/{userId}/lists")
    ResponseEntity<?> createDinerList(@PathVariable String userId, @RequestBody Object body);
}
