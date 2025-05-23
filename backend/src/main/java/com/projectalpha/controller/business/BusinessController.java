package com.projectalpha.controller.business;

import com.projectalpha.dto.GenericResponse;
import com.projectalpha.dto.business.BusinessDTO;
import com.projectalpha.dto.review.ReviewSupabase;
import com.projectalpha.service.business.BusinessService;
import com.projectalpha.service.review.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/business")
public class BusinessController {

    private final BusinessService svc;
    private final ReviewService reviewSvc;

    public BusinessController(BusinessService svc, ReviewService reviewSvc) {

        this.svc = svc;
        this.reviewSvc = reviewSvc;
    }

    @GetMapping
    public ResponseEntity<GenericResponse<List<BusinessDTO>>> getAll() {
        return ResponseEntity.ok(
                new GenericResponse<>(true, "Fetched all", svc.getAllBusinesses())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<GenericResponse<BusinessDTO>> getById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(
                    new GenericResponse<>(true, "Fetched", svc.getBusinessById(id))
            );
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new GenericResponse<>(false, e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<GenericResponse<List<BusinessDTO>>> search(@RequestParam String name) {
        return ResponseEntity.ok(
                new GenericResponse<>(true, "Search results", svc.searchByName(name))
        );
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<GenericResponse<List<BusinessDTO>>> byOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(
                new GenericResponse<>(true, "By owner", svc.getByOwnerId(ownerId))
        );
    }

    @GetMapping("/top")
    public ResponseEntity<GenericResponse<List<BusinessDTO>>> top(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(
                new GenericResponse<>(true, "Top rated", svc.getTopRated(limit))
        );
    }

    @GetMapping("/promotions/active")
    public ResponseEntity<GenericResponse<List<BusinessDTO>>> promos() {
        return ResponseEntity.ok(
                new GenericResponse<>(true, "Active promos", svc.getWithActivePromotions())
        );
    }

    @GetMapping("/tag/{tagId}")
    public ResponseEntity<GenericResponse<List<BusinessDTO>>> byTag(@PathVariable String tagId) {
        try {
            UUID uuid = UUID.fromString(tagId);
            return ResponseEntity.ok(
                    new GenericResponse<>(true, "By tag", svc.getByTag(uuid))
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new GenericResponse<>(false, "Invalid tag ID"));
        }
    }

    @GetMapping("/reviews/{businessId}")
    public ResponseEntity<GenericResponse<List<ReviewSupabase>>> reviews(@PathVariable String businessId) {
        try {
            return ResponseEntity.ok(
                    new GenericResponse<>(true, "Reviews", reviewSvc.getReviewsByBusinessId(businessId))
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new GenericResponse<>(false, "Invalid business ID"));
        }
    }
}
