package com.projectalpha.controller.user.diner;

import com.projectalpha.dto.user.diner.DinerUpdateRequest;
import com.projectalpha.dto.user.diner.DinerUserProfile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface DinerController {

    //@GetMapping("/diner_user/{userId}/profile")
    ResponseEntity<?> getDinerProfile(@PathVariable(name = "userId") String userId);

    //@PutMapping("/{userId}/profile")
    ResponseEntity<?> updateDinerProfile(@PathVariable(name = "userId") String userId, @RequestBody DinerUpdateRequest request);

    //@GetMapping("/{userId}/lists")
    ResponseEntity<?> getDinerLists(@PathVariable(name = "userId") String userId);

    //@PostMapping("/{userId}/lists")
    ResponseEntity<?> createDinerList(@PathVariable(name = "userId") String userId, @RequestBody Object body);
}
