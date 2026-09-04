package com.datta.tvaritfinal.controller;

import com.datta.tvaritfinal.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createPaymentOrder(@RequestBody Map<String, Object> body) {
        double amount = Double.parseDouble(body.getOrDefault("amount", 0.0).toString());
        String currency = body.getOrDefault("currency", "INR").toString();
        String receipt = body.getOrDefault("receipt", "tvarit_receipt").toString();
        return ResponseEntity.ok(paymentService.createPaymentOrder(amount, currency, receipt));
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, String> body) {
        String orderId = body.getOrDefault("razorpay_order_id", "");
        String paymentId = body.getOrDefault("razorpay_payment_id", "");
        String signature = body.getOrDefault("razorpay_signature", "");
        return ResponseEntity.ok(paymentService.verifyPaymentSignature(orderId, paymentId, signature));
    }
}
