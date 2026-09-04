package com.datta.tvaritfinal.controller;

import com.datta.tvaritfinal.dto.ReviewRequest;
import com.datta.tvaritfinal.dto.ReviewResponse;
import com.datta.tvaritfinal.security.UserPrincipal;
import com.datta.tvaritfinal.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // --- Customer Submits Review for Completed Order ---
    @PostMapping("/api/customer/orders/{orderId}/review")
    public ResponseEntity<ReviewResponse> submitReview(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ReviewRequest request) {
        Long customerId = (principal != null && principal.getId() != null) ? principal.getId() : 1L;
        return ResponseEntity.ok(reviewService.submitReview(customerId, orderId, request));
    }

    // --- Get Review for a Specific Order ---
    @GetMapping("/api/customer/orders/{orderId}/review")
    public ResponseEntity<ReviewResponse> getReviewForOrder(@PathVariable Long orderId) {
        return reviewService.getReviewForOrder(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    // --- Partner Views Their Reviews ---
    @GetMapping("/api/partner/reviews")
    public ResponseEntity<List<ReviewResponse>> getPartnerReviews(@AuthenticationPrincipal UserPrincipal principal) {
        Long partnerId = (principal != null && principal.getId() != null) ? principal.getId() : 1L;
        return ResponseEntity.ok(reviewService.getPartnerReviews(partnerId));
    }

    // --- Admin Views All Reviews ---
    @GetMapping("/api/admin/reviews")
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }
}
