package com.datta.tvaritfinal;

import com.datta.tvaritfinal.dto.CreateOrderRequest;
import com.datta.tvaritfinal.dto.ItemRequest;
import com.datta.tvaritfinal.dto.OrderResponse;
import com.datta.tvaritfinal.dto.RegisterCustomerRequest;
import com.datta.tvaritfinal.dto.RegisterPartnerRequest;
import com.datta.tvaritfinal.entity.OrderStatus;
import com.datta.tvaritfinal.exception.InvalidStatusTransitionException;
import com.datta.tvaritfinal.service.AuthService;
import com.datta.tvaritfinal.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class OrderLifecycleAndStateTransitionTests {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AuthService authService;

    private Long customerId;
    private Long partnerId;
    private Long secondPartnerId;

    @BeforeEach
    void setUp() {
        String suffix = UUID.randomUUID().toString().substring(0, 6);
        // Register customer
        RegisterCustomerRequest custReq = new RegisterCustomerRequest();
        custReq.setCustomerName("Order Tester");
        custReq.setCustomerEmail("ordertest_" + suffix + "@tvarit.com");
        custReq.setCustomerPhoneNumber("9988776655");
        custReq.setPassword("password123");
        custReq.setCustomerAddress("123 MG Road");
        customerId = authService.registerCustomer(custReq).getId();

        // Register partner 1
        RegisterPartnerRequest partReq1 = new RegisterPartnerRequest();
        partReq1.setPartnerName("Partner One");
        partReq1.setPartnerEmail("p1_" + suffix + "@tvarit.com");
        partReq1.setPhoneNumber("9911223344");
        partReq1.setPassword("password123");
        partnerId = authService.registerPartner(partReq1).getId();

        // Register partner 2
        RegisterPartnerRequest partReq2 = new RegisterPartnerRequest();
        partReq2.setPartnerName("Partner Two");
        partReq2.setPartnerEmail("p2_" + suffix + "@tvarit.com");
        partReq2.setPhoneNumber("9911223355");
        partReq2.setPassword("password123");
        secondPartnerId = authService.registerPartner(partReq2).getId();
    }

    @Test
    void testCompleteOrderLifecycle() {
        // 1. Create order
        CreateOrderRequest createReq = new CreateOrderRequest();
        createReq.setDeliveryAddress("123 MG Road, Ward 4");
        createReq.setCustomerArea("MG Road");
        createReq.setItems(Arrays.asList(
                new ItemRequest("2 kg Rice", 2, "kg", 60.0, "Sona masoori"),
                new ItemRequest("1 packet Sugar", 1, "packet", 45.0, "White refined")
        ));

        OrderResponse createdOrder = orderService.createOrder(customerId, createReq);
        assertNotNull(createdOrder.getOrderId());
        assertEquals(OrderStatus.CREATED, createdOrder.getStatus());
        assertEquals(2, createdOrder.getItems().size());
        assertEquals(165.0, createdOrder.getEstimatedTotal()); // (2*60) + (1*45) = 165
        assertEquals(195.0, createdOrder.getGrandTotal()); // 165 + 25 + 5 = 195

        Long orderId = createdOrder.getOrderId();

        // 2. Partner 1 accepts order
        OrderResponse acceptedOrder = orderService.acceptOrder(orderId, partnerId);
        assertEquals(OrderStatus.ACCEPTED, acceptedOrder.getStatus());
        assertEquals(partnerId, acceptedOrder.getPartnerId());

        // 3. Second partner trying to accept the same order must fail
        assertThrows(InvalidStatusTransitionException.class, () -> {
            orderService.acceptOrder(orderId, secondPartnerId);
        });

        // 4. Update checklist (Item purchased)
        Long firstItemId = acceptedOrder.getItems().get(0).getItemId();
        OrderResponse itemUpdatedOrder = orderService.updateItemPurchased(orderId, firstItemId, true, partnerId);
        assertTrue(itemUpdatedOrder.getItems().get(0).getIsPurchased());

        // 5. Advance status: ACCEPTED -> SHOPPING
        OrderResponse shoppingOrder = orderService.updateOrderStatus(orderId, partnerId, OrderStatus.SHOPPING);
        assertEquals(OrderStatus.SHOPPING, shoppingOrder.getStatus());

        // 6. Advance status: SHOPPING -> PICKED_UP
        OrderResponse pickedUpOrder = orderService.updateOrderStatus(orderId, partnerId, OrderStatus.PICKED_UP);
        assertEquals(OrderStatus.PICKED_UP, pickedUpOrder.getStatus());

        // 7. Advance status: PICKED_UP -> OUT_FOR_DELIVERY
        OrderResponse outOrder = orderService.updateOrderStatus(orderId, partnerId, OrderStatus.OUT_FOR_DELIVERY);
        assertEquals(OrderStatus.OUT_FOR_DELIVERY, outOrder.getStatus());

        // 8. Advance status: OUT_FOR_DELIVERY -> DELIVERED
        OrderResponse deliveredOrder = orderService.updateOrderStatus(orderId, partnerId, OrderStatus.DELIVERED);
        assertEquals(OrderStatus.DELIVERED, deliveredOrder.getStatus());

        // 9. Invalid transition: DELIVERED -> SHOPPING must fail!
        assertThrows(InvalidStatusTransitionException.class, () -> {
            orderService.updateOrderStatus(orderId, partnerId, OrderStatus.SHOPPING);
        });
    }

    @Test
    void testIllegalSkipStatusThrowsException() {
        CreateOrderRequest createReq = new CreateOrderRequest();
        createReq.setDeliveryAddress("123 MG Road");
        createReq.setItems(Arrays.asList(new ItemRequest("Milk", 2, "packet", 30.0, "Fresh")));

        OrderResponse createdOrder = orderService.createOrder(customerId, createReq);
        Long orderId = createdOrder.getOrderId();

        orderService.acceptOrder(orderId, partnerId);

        // Cannot skip directly from ACCEPTED to DELIVERED
        assertThrows(InvalidStatusTransitionException.class, () -> {
            orderService.updateOrderStatus(orderId, partnerId, OrderStatus.DELIVERED);
        });
    }
}
