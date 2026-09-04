package com.datta.tvaritfinal.service;

import com.datta.tvaritfinal.dto.OrderResponse;
import com.datta.tvaritfinal.dto.PartnerProfileResponse;
import com.datta.tvaritfinal.entity.CustomerOrder;
import com.datta.tvaritfinal.entity.OrderStatus;
import com.datta.tvaritfinal.entity.Partner;
import com.datta.tvaritfinal.exception.ResourceNotFoundException;
import com.datta.tvaritfinal.repository.OrderRepository;
import com.datta.tvaritfinal.repository.PartnerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PartnerService {

    private final PartnerRepository partnerRepository;
    private final OrderRepository orderRepository;
    private final CustomerService customerService;
    private final PasswordEncoder passwordEncoder;

    public PartnerService(PartnerRepository partnerRepository,
                          OrderRepository orderRepository,
                          CustomerService customerService,
                          PasswordEncoder passwordEncoder) {
        this.partnerRepository = partnerRepository;
        this.orderRepository = orderRepository;
        this.customerService = customerService;
        this.passwordEncoder = passwordEncoder;
    }

    public Partner getPartnerEntity(Long id) {
        return partnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found with id: " + id));
    }

    public PartnerProfileResponse getPartnerProfile(Long id) {
        Partner p = getPartnerEntity(id);
        return mapToPartnerProfileResponse(p);
    }

    @Transactional
    public PartnerProfileResponse toggleOnlineStatus(Long id, Boolean isOnline) {
        Partner p = getPartnerEntity(id);
        p.setIsOnline(isOnline);
        Partner saved = partnerRepository.save(p);
        return mapToPartnerProfileResponse(saved);
    }

    public List<OrderResponse> getAvailableOrders() {
        List<CustomerOrder> available = orderRepository.findByStatusOrderByCreatedTimeDesc(OrderStatus.CREATED);
        return available.stream()
                .map(customerService::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getActiveOrders(Long partnerId) {
        List<OrderStatus> activeStatuses = Arrays.asList(
                OrderStatus.ACCEPTED,
                OrderStatus.SHOPPING,
                OrderStatus.PICKED_UP,
                OrderStatus.OUT_FOR_DELIVERY
        );
        List<CustomerOrder> orders = orderRepository.findByPartnerPartnerIdOrderByCreatedTimeDesc(partnerId);
        return orders.stream()
                .filter(o -> activeStatuses.contains(o.getStatus()))
                .map(customerService::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getPartnerOrderHistory(Long partnerId) {
        List<CustomerOrder> orders = orderRepository.findByPartnerPartnerIdOrderByCreatedTimeDesc(partnerId);
        return orders.stream()
                .map(customerService::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PartnerProfileResponse updatePartner(Long id, Partner updatedInfo) {
        Partner existing = getPartnerEntity(id);

        if (updatedInfo.getPartnerName() != null && !updatedInfo.getPartnerName().isBlank()) {
            existing.setPartnerName(updatedInfo.getPartnerName().trim());
        }
        if (updatedInfo.getPhoneNumber() != null && !updatedInfo.getPhoneNumber().isBlank()) {
            existing.setPhoneNumber(updatedInfo.getPhoneNumber().trim());
        }
        if (updatedInfo.getPassword() != null && !updatedInfo.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(updatedInfo.getPassword()));
        }

        Partner saved = partnerRepository.save(existing);
        return mapToPartnerProfileResponse(saved);
    }

    public PartnerProfileResponse mapToPartnerProfileResponse(Partner p) {
        return new PartnerProfileResponse(
                p.getPartnerId(),
                p.getPartnerName(),
                p.getPartnerEmail(),
                p.getPhoneNumber(),
                p.getIsOnline(),
                p.getRating(),
                p.getTotalEarnings(),
                p.getCompletedOrdersCount(),
                p.getRole(),
                p.getCreatedTime()
        );
    }
}