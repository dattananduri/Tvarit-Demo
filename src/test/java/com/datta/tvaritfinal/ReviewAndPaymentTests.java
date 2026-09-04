package com.datta.tvaritfinal;

import com.datta.tvaritfinal.dto.*;
import com.datta.tvaritfinal.entity.OrderStatus;
import com.datta.tvaritfinal.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ReviewAndPaymentTests {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AuthService authService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private CustomerService customerService;

    private Long customerId;
    private Long partnerId;

    @BeforeEach
    void setUp() {
        String suffix = UUID.randomUUID().toString().substring(0, 6);

        RegisterCustomerRequest custReq = new RegisterCustomerRequest();
        custReq.setCustomerName("Review Tester");
        custReq.setCustomerEmail("reviewtest_" + suffix + "@tvarit.com");
        custReq.setCustomerPhoneNumber("9988776600");
        custReq.setPassword("password123");
        custReq.setCustomerAddress("456 Park Avenue");
        customerId = authService.registerCustomer(custReq).getId();

        RegisterPartnerRequest partReq = new RegisterPartnerRequest();
        partReq.setPartnerName("Delivery Pro");
        partReq.setPartnerEmail("driver_" + suffix + "@tvarit.com");
        partReq.setPhoneNumber("9911223399");
        partReq.setPassword("password123");
        partnerId = authService.registerPartner(partReq).getId();
    }

    @Test
    void testCompletePaymentAndReviewWorkflow() {
        // 1. Test Payment Order Generation
        Map<String, Object> paymentOrder = paymentService.createPaymentOrder(250.0, "INR", "receipt_001");
        assertNotNull(paymentOrder);
        assertTrue(paymentOrder.containsKey("orderId"));
        assertTrue(paymentOrder.containsKey("amount"));

        // 2. Test Payment Verification
        Map<String, Object> verifyResult = paymentService.verifyPaymentSignature(
                paymentOrder.get("orderId").toString(),
                "pay_test_12345",
                "mock_sig"
        );
        assertTrue((Boolean) verifyResult.get("verified"));

        // 3. Create Order
        CreateOrderRequest createReq = new CreateOrderRequest();
        createReq.setDeliveryAddress("456 Park Avenue");
        createReq.setCustomerArea("Park Avenue");
        createReq.setItems(Arrays.asList(
                new ItemRequest("Organic Milk", 2, "packet", 35.0, "Fresh")
        ));
        OrderResponse order = orderService.createOrder(customerId, createReq);
        Long orderId = order.getOrderId();

        // 4. Partner completes delivery
        orderService.acceptOrder(orderId, partnerId);
        orderService.updateOrderStatus(orderId, partnerId, OrderStatus.SHOPPING);
        orderService.updateOrderStatus(orderId, partnerId, OrderStatus.PICKED_UP);
        orderService.updateOrderStatus(orderId, partnerId, OrderStatus.OUT_FOR_DELIVERY);
        orderService.updateOrderStatus(orderId, partnerId, OrderStatus.DELIVERED);

        // 5. Customer submits review
        ReviewRequest reviewReq = new ReviewRequest(5, "Prompt local delivery! Everything arrived in perfect shape.");
        ReviewResponse review = reviewService.submitReview(customerId, orderId, reviewReq);

        assertNotNull(review.getReviewId());
        assertEquals(5, review.getRating());
        assertEquals("Review Tester", review.getCustomerName());

        // 6. Verify review can be queried
        assertTrue(reviewService.getReviewForOrder(orderId).isPresent());
        assertEquals(1, reviewService.getPartnerReviews(partnerId).size());
    }

    @Test
    void testCustomerDefaultAddressSwitching() {
        AddressRequest addr1 = new AddressRequest("Home", "Flat 101", "Sector 1", "Mysore", "570001", null, null, true);
        AddressRequest addr2 = new AddressRequest("Work", "Tech Hub", "Sector 5", "Mysore", "570016", null, null, false);

        AddressResponse res1 = customerService.addAddress(customerId, addr1);
        AddressResponse res2 = customerService.addAddress(customerId, addr2);

        // Switch default address to addr2
        AddressResponse updatedDefault = customerService.setDefaultAddress(res2.getAddressId(), customerId);
        assertTrue(updatedDefault.getIsDefault());

        // Verify customer profile address is updated
        CustomerProfileResponse profile = customerService.getCustomerProfile(customerId);
        assertTrue(profile.getCustomerAddress().contains("Tech Hub"));
    }
}
