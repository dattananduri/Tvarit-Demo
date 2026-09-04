package com.datta.tvaritfinal.controller;

import com.datta.tvaritfinal.dto.*;
import com.datta.tvaritfinal.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/customer")
    public ResponseEntity<AuthResponse> registerCustomer(@Valid @RequestBody RegisterCustomerRequest request) {
        return ResponseEntity.ok(authService.registerCustomer(request));
    }

    @PostMapping("/register/partner")
    public ResponseEntity<AuthResponse> registerPartner(@Valid @RequestBody RegisterPartnerRequest request) {
        return ResponseEntity.ok(authService.registerPartner(request));
    }

    @PostMapping("/customer/login")
    public ResponseEntity<AuthResponse> loginCustomer(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.loginCustomer(request));
    }

    @PostMapping("/partner/login")
    public ResponseEntity<AuthResponse> loginPartner(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.loginPartner(request));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> loginAdmin(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.loginAdmin(request));
    }
}
