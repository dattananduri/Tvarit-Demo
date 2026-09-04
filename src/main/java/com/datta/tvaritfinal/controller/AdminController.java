package com.datta.tvaritfinal.controller;

import com.datta.tvaritfinal.dto.AdminStatsResponse;
import com.datta.tvaritfinal.dto.CustomerProfileResponse;
import com.datta.tvaritfinal.dto.OrderResponse;
import com.datta.tvaritfinal.dto.PartnerProfileResponse;
import com.datta.tvaritfinal.entity.OrderStatus;
import com.datta.tvaritfinal.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getOrders(@RequestParam(required = false) OrderStatus status) {
        return ResponseEntity.ok(adminService.getAllOrders(status));
    }

    @GetMapping("/partners")
    public ResponseEntity<List<PartnerProfileResponse>> getPartners() {
        return ResponseEntity.ok(adminService.getAllPartners());
    }

    @GetMapping("/customers")
    public ResponseEntity<List<CustomerProfileResponse>> getCustomers() {
        return ResponseEntity.ok(adminService.getAllCustomers());
    }
}
