package com.projectalpha.controller.user.owner;

import com.projectalpha.dto.user.owner.OwnerUserProfile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface OwnerController {

    @GetMapping("/{userId}/profile")
    ResponseEntity<?> getOwnerProfile(@PathVariable String userId);

    @PutMapping("/{userId}/profile")
    ResponseEntity<?> updateOwnerProfile(@PathVariable String userId, @RequestBody OwnerUserProfile profile);

    // Owner’a özel başka endpointler burada tanımlanabilir
}
