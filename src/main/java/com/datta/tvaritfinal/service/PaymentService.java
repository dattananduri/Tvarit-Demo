package com.datta.tvaritfinal.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Value("${tvarit.razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${tvarit.razorpay.key-secret:}")
    private String razorpayKeySecret;

    public boolean isRazorpayConfigured() {
        return razorpayKeyId != null && !razorpayKeyId.isBlank()
                && razorpayKeySecret != null && !razorpayKeySecret.isBlank();
    }

    public Map<String, Object> createPaymentOrder(double amount, String currency, String receipt) {
        Map<String, Object> response = new HashMap<>();

        if (isRazorpayConfigured()) {
            logger.info("Razorpay Keys Active (KeyId: {}). Creating payment order for amount: ₹{}", razorpayKeyId, amount);
            response.put("mode", "RAZORPAY_TEST");
            response.put("keyId", razorpayKeyId);
            response.put("orderId", "order_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14));
            response.put("amount", (long) (amount * 100)); // paise
            response.put("currency", (currency != null && !currency.isBlank()) ? currency : "INR");
            response.put("isLive", true);
        } else {
            logger.info("Razorpay keys not provided. Using clearly labelled DEMO PAYMENT Mode for amount: ₹{}", amount);
            response.put("mode", "DEMO_PAYMENT");
            response.put("keyId", "rzp_test_tvarit_demo");
            response.put("orderId", "demo_order_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10));
            response.put("amount", (long) (amount * 100));
            response.put("currency", (currency != null && !currency.isBlank()) ? currency : "INR");
            response.put("status", "PAID");
            response.put("isLive", false);
        }

        return response;
    }

    public Map<String, Object> verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        Map<String, Object> result = new HashMap<>();

        if (!isRazorpayConfigured()) {
            // Demo payment verification always succeeds
            result.put("verified", true);
            result.put("paymentId", razorpayPaymentId != null ? razorpayPaymentId : "demo_pay_" + UUID.randomUUID().toString().substring(0, 8));
            result.put("message", "Demo payment verified successfully");
            return result;
        }

        try {
            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            String calculatedSignature = hexString.toString();

            boolean isValid = calculatedSignature.equalsIgnoreCase(razorpaySignature);
            result.put("verified", isValid);
            result.put("paymentId", razorpayPaymentId);
            result.put("message", isValid ? "Razorpay signature verified successfully" : "Invalid signature verification");
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            logger.error("Error during HMAC signature calculation", e);
            result.put("verified", false);
            result.put("message", "Error calculating HMAC-SHA256 signature");
        }

        return result;
    }
}
