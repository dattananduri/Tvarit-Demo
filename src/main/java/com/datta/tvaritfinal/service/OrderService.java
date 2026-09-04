package com.datta.tvaritfinal.service;

import com.datta.tvaritfinal.dto.*;
import com.datta.tvaritfinal.entity.*;
import com.datta.tvaritfinal.exception.InvalidOrderException;
import com.datta.tvaritfinal.exception.InvalidStatusTransitionException;
import com.datta.tvaritfinal.exception.ResourceNotFoundException;
import com.datta.tvaritfinal.exception.UnauthorizedException;
import com.datta.tvaritfinal.repository.CustomerRepository;
import com.datta.tvaritfinal.repository.ItemRepository;
import com.datta.tvaritfinal.repository.OrderRepository;
import com.datta.tvaritfinal.repository.PartnerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final PartnerRepository partnerRepository;
    private final CustomerRepository customerRepository;
    private final ItemRepository itemRepository;
    private final CustomerService customerService;
    private final NotificationService notificationService;

    public OrderService(OrderRepository orderRepository,
                        PartnerRepository partnerRepository,
                        CustomerRepository customerRepository,
                        ItemRepository itemRepository,
                        CustomerService customerService,
                        NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.partnerRepository = partnerRepository;
        this.customerRepository = customerRepository;
        this.itemRepository = itemRepository;
        this.customerService = customerService;
        this.notificationService = notificationService;
    }

    public CustomerOrder getOrderEntity(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    public OrderResponse getOrder(Long id) {
        CustomerOrder order = getOrderEntity(id);
        return customerService.mapToOrderResponse(order);
    }

    @Transactional
    public OrderResponse createOrder(Long customerId, CreateOrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new InvalidOrderException("Order must contain at least one item");
        }

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        CustomerOrder order = new CustomerOrder();
        order.setCustomer(customer);
        order.setDeliveryAddress(request.getDeliveryAddress().trim());
        order.setCustomerArea(request.getCustomerArea() != null ? request.getCustomerArea().trim() : "Local Area");
        order.setCustomerPhone(request.getCustomerPhone() != null && !request.getCustomerPhone().isBlank() ?
                request.getCustomerPhone().trim() : customer.getCustomerPhoneNumber());
        order.setPartnerNotes(request.getPartnerNotes());
        order.setStatus(OrderStatus.CREATED);
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "TEST_PAYMENT");
        order.setPaymentStatus("PAID");
        order.setPaymentId("pay_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12));
        order.setCreatedTime(LocalDateTime.now());
        order.setUpdatedTime(LocalDateTime.now());

        double estimatedItemsTotal = 0.0;
        List<Item> items = new ArrayList<>();

        for (ItemRequest itemReq : request.getItems()) {
            if (itemReq.getItemName() == null || itemReq.getItemName().isBlank()) {
                throw new InvalidOrderException("Item name cannot be blank");
            }
            if (itemReq.getItemQuantity() == null || itemReq.getItemQuantity() <= 0) {
                throw new InvalidOrderException("Item quantity must be greater than 0 for " + itemReq.getItemName());
            }

            Item item = new Item();
            item.setItemName(itemReq.getItemName().trim());
            item.setItemQuantity(itemReq.getItemQuantity());
            item.setUnit(itemReq.getUnit() != null ? itemReq.getUnit() : "unit");
            double price = (itemReq.getItemPrice() != null && itemReq.getItemPrice() > 0) ?
                    itemReq.getItemPrice() : estimateItemPrice(itemReq.getItemName());
            item.setItemPrice(price);
            item.setNotes(itemReq.getNotes());
            item.setIsPurchased(false);
            item.setOrder(order);

            items.add(item);
            estimatedItemsTotal += (price * itemReq.getItemQuantity());
        }

        order.setItems(items);
        order.setEstimatedTotal(estimatedItemsTotal);
        order.setDeliveryFee(25.0);
        order.setPlatformFee(5.0);
        order.setGrandTotal(estimatedItemsTotal + 25.0 + 5.0);

        CustomerOrder saved = orderRepository.save(order);

        // Notify customer
        notificationService.createNotification(
                customer.getCustomerId(),
                "ROLE_CUSTOMER",
                saved.getOrderId(),
                "Order Request Placed (#" + saved.getOrderId() + ")",
                "Your request for " + saved.getItems().size() + " items has been broadcast to nearby delivery runners.",
                "ORDER_CREATED"
        );

        return customerService.mapToOrderResponse(saved);
    }

    @Transactional
    public OrderResponse acceptOrder(Long orderId, Long partnerId) {
        CustomerOrder order = getOrderEntity(orderId);

        if (order.getStatus() != OrderStatus.CREATED) {
            throw new InvalidStatusTransitionException("This order has already been accepted.");
        }

        Partner partner = partnerRepository.findById(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found with id: " + partnerId));

        if (!Boolean.TRUE.equals(partner.getIsOnline())) {
            throw new InvalidOrderException("Partner must be Online to accept orders");
        }

        order.setPartner(partner);
        order.setStatus(OrderStatus.ACCEPTED);
        order.setUpdatedTime(LocalDateTime.now());

        CustomerOrder saved = orderRepository.save(order);

        // Notify customer that partner accepted
        notificationService.createNotification(
                order.getCustomer().getCustomerId(),
                "ROLE_CUSTOMER",
                saved.getOrderId(),
                "Runner Assigned!",
                partner.getPartnerName() + " has accepted your order and is heading to a local neighborhood shop.",
                "ORDER_ACCEPTED"
        );

        // Notify partner
        notificationService.createNotification(
                partner.getPartnerId(),
                "ROLE_PARTNER",
                saved.getOrderId(),
                "Order #" + saved.getOrderId() + " Assigned",
                "You are assigned to " + order.getCustomer().getCustomerName() + "'s order. Review the shopping list.",
                "ORDER_ACCEPTED"
        );

        return customerService.mapToOrderResponse(saved);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, Long partnerId, OrderStatus newStatus) {
        CustomerOrder order = getOrderEntity(orderId);

        if (order.getPartner() == null || !order.getPartner().getPartnerId().equals(partnerId)) {
            throw new UnauthorizedException("Only the assigned delivery partner can update this order's status");
        }

        OrderStatus currentStatus = order.getStatus();
        validateStatusTransition(currentStatus, newStatus);

        order.setStatus(newStatus);
        order.setUpdatedTime(LocalDateTime.now());

        // Lifecycle Notifications
        if (newStatus == OrderStatus.SHOPPING) {
            notificationService.createNotification(
                    order.getCustomer().getCustomerId(),
                    "ROLE_CUSTOMER",
                    order.getOrderId(),
                    "Shopping in Progress",
                    order.getPartner().getPartnerName() + " is currently at a local shop purchasing your items.",
                    "SHOPPING_STARTED"
            );
        } else if (newStatus == OrderStatus.PICKED_UP) {
            notificationService.createNotification(
                    order.getCustomer().getCustomerId(),
                    "ROLE_CUSTOMER",
                    order.getOrderId(),
                    "Items Picked Up & Packed",
                    "All items have been purchased and packed. Ready for dispatch.",
                    "PICKED_UP"
            );
        } else if (newStatus == OrderStatus.OUT_FOR_DELIVERY) {
            notificationService.createNotification(
                    order.getCustomer().getCustomerId(),
                    "ROLE_CUSTOMER",
                    order.getOrderId(),
                    "Out for Delivery",
                    order.getPartner().getPartnerName() + " is riding to your delivery address now!",
                    "OUT_FOR_DELIVERY"
            );
        } else if (newStatus == OrderStatus.DELIVERED) {
            Partner partner = order.getPartner();
            double earning = 40.0;
            partner.setTotalEarnings((partner.getTotalEarnings() != null ? partner.getTotalEarnings() : 0.0) + earning);
            partner.setCompletedOrdersCount((partner.getCompletedOrdersCount() != null ? partner.getCompletedOrdersCount() : 0) + 1);
            partnerRepository.save(partner);

            notificationService.createNotification(
                    order.getCustomer().getCustomerId(),
                    "ROLE_CUSTOMER",
                    order.getOrderId(),
                    "Order Delivered Successfully!",
                    "Your order has been delivered at your doorstep. Thank you for choosing Tvarit!",
                    "DELIVERED"
            );

            notificationService.createNotification(
                    partner.getPartnerId(),
                    "ROLE_PARTNER",
                    order.getOrderId(),
                    "Payout Credited (+₹40.00)",
                    "Trip completed! ₹40.00 has been credited to your partner earnings wallet.",
                    "DELIVERED"
            );
        }

        CustomerOrder saved = orderRepository.save(order);
        return customerService.mapToOrderResponse(saved);
    }

    @Transactional
    public OrderResponse updateItemPurchased(Long orderId, Long itemId, Boolean isPurchased, Long partnerId) {
        CustomerOrder order = getOrderEntity(orderId);

        if (order.getPartner() == null || !order.getPartner().getPartnerId().equals(partnerId)) {
            throw new UnauthorizedException("Only the assigned delivery partner can update item purchase status");
        }

        boolean found = false;
        for (Item item : order.getItems()) {
            if (item.getItemId().equals(itemId)) {
                item.setIsPurchased(isPurchased);
                found = true;
                break;
            }
        }

        if (!found) {
            throw new ResourceNotFoundException("Item #" + itemId + " not found in order #" + orderId);
        }

        order.setUpdatedTime(LocalDateTime.now());
        CustomerOrder saved = orderRepository.save(order);
        return customerService.mapToOrderResponse(saved);
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long requesterId, boolean isAdmin) {
        CustomerOrder order = getOrderEntity(orderId);

        if (!isAdmin && order.getCustomer() != null && !order.getCustomer().getCustomerId().equals(requesterId)) {
            throw new UnauthorizedException("You are not authorized to cancel this order");
        }

        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new InvalidStatusTransitionException("Cannot cancel an order that has already been delivered");
        }

        if (order.getStatus() == OrderStatus.SHOPPING || order.getStatus() == OrderStatus.PICKED_UP || order.getStatus() == OrderStatus.OUT_FOR_DELIVERY) {
            throw new InvalidStatusTransitionException("Cannot cancel order while partner is shopping or out for delivery. Please contact support.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedTime(LocalDateTime.now());

        if (order.getCustomer() != null) {
            notificationService.createNotification(
                    order.getCustomer().getCustomerId(),
                    "ROLE_CUSTOMER",
                    order.getOrderId(),
                    "Order Cancelled",
                    "Your order request #" + order.getOrderId() + " has been cancelled.",
                    "CANCELLED"
            );
        }

        CustomerOrder saved = orderRepository.save(order);
        return customerService.mapToOrderResponse(saved);
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus next) {
        if (current == next) {
            return;
        }

        switch (current) {
            case CREATED:
                if (next != OrderStatus.ACCEPTED && next != OrderStatus.CANCELLED) {
                    throw new InvalidStatusTransitionException("Order must be ACCEPTED by a partner before transitioning to " + next);
                }
                break;
            case ACCEPTED:
                if (next != OrderStatus.SHOPPING && next != OrderStatus.CANCELLED) {
                    throw new InvalidStatusTransitionException("Accepted order must transition to SHOPPING or CANCELLED, not " + next);
                }
                break;
            case SHOPPING:
                if (next != OrderStatus.PICKED_UP) {
                    throw new InvalidStatusTransitionException("Shopping order must transition to PICKED_UP next, not " + next);
                }
                break;
            case PICKED_UP:
                if (next != OrderStatus.OUT_FOR_DELIVERY) {
                    throw new InvalidStatusTransitionException("Picked up order must transition to OUT_FOR_DELIVERY next, not " + next);
                }
                break;
            case OUT_FOR_DELIVERY:
                if (next != OrderStatus.DELIVERED) {
                    throw new InvalidStatusTransitionException("Out for delivery order must transition to DELIVERED, not " + next);
                }
                break;
            case DELIVERED:
                throw new InvalidStatusTransitionException("Cannot change status of an already DELIVERED order");
            case CANCELLED:
                throw new InvalidStatusTransitionException("Cannot change status of a CANCELLED order");
            default:
                throw new InvalidStatusTransitionException("Invalid transition from " + current + " to " + next);
        }
    }

    private double estimateItemPrice(String itemName) {
        String lower = itemName.toLowerCase();
        if (lower.contains("milk")) return 30.0;
        if (lower.contains("rice")) return 60.0;
        if (lower.contains("sugar")) return 45.0;
        if (lower.contains("bread")) return 35.0;
        if (lower.contains("egg")) return 7.0;
        if (lower.contains("butter")) return 55.0;
        if (lower.contains("tomato")) return 40.0;
        if (lower.contains("potato")) return 30.0;
        if (lower.contains("onion")) return 40.0;
        if (lower.contains("atta") || lower.contains("flour")) return 50.0;
        if (lower.contains("oil")) return 140.0;
        if (lower.contains("tea") || lower.contains("chai")) return 80.0;
        if (lower.contains("biscuit") || lower.contains("cookie")) return 20.0;
        return 40.0;
    }
}