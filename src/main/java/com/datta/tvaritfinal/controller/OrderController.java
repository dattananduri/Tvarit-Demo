package com.datta.tvaritfinal.controller;

import com.datta.tvaritfinal.dto.*;
import com.datta.tvaritfinal.entity.OrderStatus;
import com.datta.tvaritfinal.security.UserPrincipal;
import com.datta.tvaritfinal.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // --- Create Order ---
    @PostMapping({"/api/orders", "/orders"})
    public ResponseEntity<OrderResponse> createOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateOrderRequest request,
            @RequestParam(required = false) Long customerId) {
        Long effectiveCustomerId = (principal != null && principal.getId() != null) ? principal.getId() : customerId;
        if (effectiveCustomerId == null) {
            effectiveCustomerId = 1L; // fallback demo id
        }
        return ResponseEntity.ok(orderService.createOrder(effectiveCustomerId, request));
    }

    // --- Get Order by ID ---
    @GetMapping({"/api/orders/{id}", "/orders/{id}"})
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrder(id));
    }

    // --- Accept Order (Partner) ---
    @PutMapping("/api/orders/{id}/accept")
    public ResponseEntity<OrderResponse> acceptOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(orderService.acceptOrder(id, principal.getId()));
    }

    // Legacy accept order: /orders/{orderId}/accept/{partnerId}
    @PutMapping("/orders/{orderId}/accept/{partnerId}")
    public ResponseEntity<OrderResponse> acceptOrderLegacy(
            @PathVariable Long orderId,
            @PathVariable Long partnerId) {
        return ResponseEntity.ok(orderService.acceptOrder(orderId, partnerId));
    }

    // --- Update Status ---
    @PutMapping("/api/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, principal.getId(), request.getStatus()));
    }

    // Legacy update status: /orders/{id}/{status}
    @PutMapping("/orders/{id}/{status}")
    public ResponseEntity<OrderResponse> updateOrderStatusLegacy(
            @PathVariable Long id,
            @PathVariable String status,
            @RequestParam(required = false) Long partnerId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectivePartnerId = (principal != null && principal.getId() != null) ? principal.getId() : partnerId;
        OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
        return ResponseEntity.ok(orderService.updateOrderStatus(id, effectivePartnerId, newStatus));
    }

    // --- Toggle Item Purchased Checklist (Partner Shopping Screen) ---
    @PutMapping("/api/orders/{id}/items/{itemId}/purchase")
    public ResponseEntity<OrderResponse> updateItemPurchased(
            @PathVariable Long id,
            @PathVariable Long itemId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ItemPurchaseRequest request) {
        return ResponseEntity.ok(orderService.updateItemPurchased(id, itemId, request.getIsPurchased(), principal.getId()));
    }

    // --- Cancel Order ---
    @PutMapping("/api/orders/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        boolean isAdmin = principal != null && "ROLE_ADMIN".equals(principal.getRole());
        Long requesterId = principal != null ? principal.getId() : 0L;
        return ResponseEntity.ok(orderService.cancelOrder(id, requesterId, isAdmin));
    }
}