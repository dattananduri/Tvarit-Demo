package com.datta.tvaritfinal.controller;

import com.datta.tvaritfinal.dto.*;
import com.datta.tvaritfinal.entity.Customer;
import com.datta.tvaritfinal.security.UserPrincipal;
import com.datta.tvaritfinal.service.AuthService;
import com.datta.tvaritfinal.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class CustomerController {

    private final CustomerService customerService;
    private final AuthService authService;

    public CustomerController(CustomerService customerService, AuthService authService) {
        this.customerService = customerService;
        this.authService = authService;
    }

    // --- Legacy Endpoints for compatibility ---
    @PostMapping("/customer/login")
    public ResponseEntity<AuthResponse> loginCustomerLegacy(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.loginCustomer(loginRequest));
    }

    @PostMapping("/customer/register")
    public ResponseEntity<AuthResponse> registerCustomerLegacy(@RequestBody RegisterCustomerRequest customer) {
        return ResponseEntity.ok(authService.registerCustomer(customer));
    }

    @GetMapping("/customer/profile/{id}")
    public ResponseEntity<CustomerProfileResponse> getCustomerLegacy(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerProfile(id));
    }

    @PutMapping("/customer/profile/{id}")
    public ResponseEntity<CustomerProfileResponse> updateCustomerLegacy(
            @PathVariable Long id,
            @RequestBody UpdateCustomerRequest customer) {
        return ResponseEntity.ok(customerService.updateCustomer(id, customer));
    }

    @GetMapping("/customer/{id}/orders")
    public ResponseEntity<List<OrderResponse>> getOrdersLegacy(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getOrders(id));
    }

    // --- Modern REST API Endpoints ---
    @GetMapping("/api/customer/me")
    public ResponseEntity<CustomerProfileResponse> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(customerService.getCustomerProfile(principal.getId()));
    }

    @PutMapping("/api/customer/me")
    public ResponseEntity<CustomerProfileResponse> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody UpdateCustomerRequest request) {
        return ResponseEntity.ok(customerService.updateCustomer(principal.getId(), request));
    }

    @GetMapping("/api/customer/orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(customerService.getOrders(principal.getId()));
    }

    @GetMapping("/api/customer/addresses")
    public ResponseEntity<List<AddressResponse>> getAddresses(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(customerService.getCustomerAddresses(principal.getId()));
    }

    @PostMapping("/api/customer/addresses")
    public ResponseEntity<AddressResponse> addAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(customerService.addAddress(principal.getId(), request));
    }

    @PutMapping("/api/customer/addresses/{addressId}/default")
    public ResponseEntity<AddressResponse> setDefaultAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long addressId) {
        return ResponseEntity.ok(customerService.setDefaultAddress(addressId, principal.getId()));
    }

    @DeleteMapping("/api/customer/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long addressId) {
        customerService.deleteAddress(addressId, principal.getId());
        return ResponseEntity.noContent().build();
    }
}

