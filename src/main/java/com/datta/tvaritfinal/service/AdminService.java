package com.datta.tvaritfinal.service;

import com.datta.tvaritfinal.dto.AdminStatsResponse;
import com.datta.tvaritfinal.dto.CustomerProfileResponse;
import com.datta.tvaritfinal.dto.OrderResponse;
import com.datta.tvaritfinal.dto.PartnerProfileResponse;
import com.datta.tvaritfinal.entity.CustomerOrder;
import com.datta.tvaritfinal.entity.OrderStatus;
import com.datta.tvaritfinal.repository.CustomerRepository;
import com.datta.tvaritfinal.repository.OrderRepository;
import com.datta.tvaritfinal.repository.PartnerRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final CustomerRepository customerRepository;
    private final PartnerRepository partnerRepository;
    private final OrderRepository orderRepository;
    private final CustomerService customerService;
    private final PartnerService partnerService;

    public AdminService(CustomerRepository customerRepository,
                        PartnerRepository partnerRepository,
                        OrderRepository orderRepository,
                        CustomerService customerService,
                        PartnerService partnerService) {
        this.customerRepository = customerRepository;
        this.partnerRepository = partnerRepository;
        this.orderRepository = orderRepository;
        this.customerService = customerService;
        this.partnerService = partnerService;
    }

    public AdminStatsResponse getStats() {
        long totalCustomers = customerRepository.count();
        long totalPartners = partnerRepository.count();
        long onlinePartners = partnerRepository.findByIsOnlineTrue().size();
        long totalOrders = orderRepository.count();

        List<CustomerOrder> allOrders = orderRepository.findAll();

        List<OrderStatus> activeStatuses = Arrays.asList(
                OrderStatus.CREATED,
                OrderStatus.ACCEPTED,
                OrderStatus.SHOPPING,
                OrderStatus.PICKED_UP,
                OrderStatus.OUT_FOR_DELIVERY
        );

        long activeOrders = allOrders.stream().filter(o -> activeStatuses.contains(o.getStatus())).count();
        long completedOrders = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.DELIVERED).count();
        long cancelledOrders = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.CANCELLED).count();

        double grossOrderValue = allOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .mapToDouble(o -> o.getGrandTotal() != null ? o.getGrandTotal() : 0.0)
                .sum();

        return new AdminStatsResponse(
                totalCustomers,
                totalPartners,
                onlinePartners,
                totalOrders,
                activeOrders,
                completedOrders,
                cancelledOrders,
                grossOrderValue
        );
    }

    public List<OrderResponse> getAllOrders(OrderStatus statusFilter) {
        List<CustomerOrder> orders;
        if (statusFilter != null) {
            orders = orderRepository.findByStatusOrderByCreatedTimeDesc(statusFilter);
        } else {
            orders = orderRepository.findAllByOrderByCreatedTimeDesc();
        }
        return orders.stream().map(customerService::mapToOrderResponse).collect(Collectors.toList());
    }

    public List<PartnerProfileResponse> getAllPartners() {
        return partnerRepository.findAll().stream()
                .map(partnerService::mapToPartnerProfileResponse)
                .collect(Collectors.toList());
    }

    public List<CustomerProfileResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(c -> new CustomerProfileResponse(
                        c.getCustomerId(),
                        c.getCustomerName(),
                        c.getCustomerEmail(),
                        c.getCustomerPhoneNumber(),
                        c.getCustomerAddress(),
                        c.getRole(),
                        c.getCreatedTime()
                ))
                .collect(Collectors.toList());
    }
}
