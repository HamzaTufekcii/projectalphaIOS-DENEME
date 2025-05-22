package com.projectalpha.controller.user.owner;

import com.projectalpha.dto.user.owner.OwnerUpdateRequest;
import com.projectalpha.dto.user.owner.OwnerUserProfile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface OwnerController {

    ResponseEntity<?> getOwnerProfile(@PathVariable String userId);

    ResponseEntity<?> updateOwnerProfile(@PathVariable String userId, @RequestBody OwnerUpdateRequest request);

    // Owner’a özel başka endpointler burada tanımlanabilir
}
