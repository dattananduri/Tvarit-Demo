package com.datta.tvaritfinal.controller;

import com.datta.tvaritfinal.dto.*;
import com.datta.tvaritfinal.entity.Partner;
import com.datta.tvaritfinal.security.UserPrincipal;
import com.datta.tvaritfinal.service.AuthService;
import com.datta.tvaritfinal.service.PartnerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
public class PartnerController {

    private final PartnerService partnerService;
    private final AuthService authService;

    public PartnerController(PartnerService partnerService, AuthService authService) {
        this.partnerService = partnerService;
        this.authService = authService;
    }

    // --- Legacy Endpoints for Compatibility ---
    @PostMapping("/partner/register")
    public ResponseEntity<AuthResponse> registerPartnerLegacy(@Valid @RequestBody RegisterPartnerRequest partner) {
        return ResponseEntity.ok(authService.registerPartner(partner));
    }

    @PostMapping("/partner/login")
    public ResponseEntity<AuthResponse> loginPartnerLegacy(@Valid @RequestBody LoginRequest partner) {
        return ResponseEntity.ok(authService.loginPartner(partner));
    }

    @GetMapping("/partner/profile/{id}")
    public ResponseEntity<PartnerProfileResponse> getPartnerLegacy(@PathVariable Long id) {
        return ResponseEntity.ok(partnerService.getPartnerProfile(id));
    }

    @PutMapping("/partner/profile/{id}")
    public ResponseEntity<PartnerProfileResponse> updatePartnerLegacy(
            @PathVariable Long id,
            @RequestBody Partner partner) {
        return ResponseEntity.ok(partnerService.updatePartner(id, partner));
    }

    // --- Modern REST API Endpoints ---
    @GetMapping("/api/partner/me")
    public ResponseEntity<PartnerProfileResponse> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(partnerService.getPartnerProfile(principal.getId()));
    }

    @PutMapping("/api/partner/me")
    public ResponseEntity<PartnerProfileResponse> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Partner partner) {
        return ResponseEntity.ok(partnerService.updatePartner(principal.getId(), partner));
    }

    @PutMapping("/api/partner/toggle-status")
    public ResponseEntity<PartnerProfileResponse> toggleStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, Boolean> body) {
        Boolean isOnline = body.getOrDefault("isOnline", true);
        return ResponseEntity.ok(partnerService.toggleOnlineStatus(principal.getId(), isOnline));
    }

    @GetMapping("/api/partner/orders/available")
    public ResponseEntity<List<OrderResponse>> getAvailableOrders() {
        return ResponseEntity.ok(partnerService.getAvailableOrders());
    }

    @GetMapping("/api/partner/orders/active")
    public ResponseEntity<List<OrderResponse>> getActiveOrders(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(partnerService.getActiveOrders(principal.getId()));
    }

    @GetMapping("/api/partner/orders/history")
    public ResponseEntity<List<OrderResponse>> getOrderHistory(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(partnerService.getPartnerOrderHistory(principal.getId()));
    }

    @GetMapping("/api/partner/earnings")
    public ResponseEntity<PartnerProfileResponse> getEarnings(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(partnerService.getPartnerProfile(principal.getId()));
    }
}