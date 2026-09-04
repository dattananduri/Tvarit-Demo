package com.datta.tvaritfinal.service;

import com.datta.tvaritfinal.dto.*;
import com.datta.tvaritfinal.entity.Address;
import com.datta.tvaritfinal.entity.Customer;
import com.datta.tvaritfinal.entity.CustomerOrder;
import com.datta.tvaritfinal.exception.ResourceNotFoundException;
import com.datta.tvaritfinal.repository.AddressRepository;
import com.datta.tvaritfinal.repository.CustomerRepository;
import com.datta.tvaritfinal.repository.OrderRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerService(CustomerRepository customerRepository,
                           OrderRepository orderRepository,
                           AddressRepository addressRepository,
                           PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Customer getCustomerEntity(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    public CustomerProfileResponse getCustomerProfile(Long id) {
        Customer customer = getCustomerEntity(id);
        return new CustomerProfileResponse(
                customer.getCustomerId(),
                customer.getCustomerName(),
                customer.getCustomerEmail(),
                customer.getCustomerPhoneNumber(),
                customer.getCustomerAddress(),
                customer.getRole(),
                customer.getCreatedTime()
        );
    }

    @Transactional
    public CustomerProfileResponse updateCustomer(Long id, UpdateCustomerRequest request) {
        Customer existing = getCustomerEntity(id);

        if (request.getCustomerName() != null && !request.getCustomerName().isBlank()) {
            existing.setCustomerName(request.getCustomerName().trim());
        }
        if (request.getCustomerPhoneNumber() != null && !request.getCustomerPhoneNumber().isBlank()) {
            existing.setCustomerPhoneNumber(request.getCustomerPhoneNumber().trim());
        }
        if (request.getCustomerAddress() != null && !request.getCustomerAddress().isBlank()) {
            existing.setCustomerAddress(request.getCustomerAddress().trim());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        Customer saved = customerRepository.save(existing);
        return new CustomerProfileResponse(
                saved.getCustomerId(),
                saved.getCustomerName(),
                saved.getCustomerEmail(),
                saved.getCustomerPhoneNumber(),
                saved.getCustomerAddress(),
                saved.getRole(),
                saved.getCreatedTime()
        );
    }

    public List<OrderResponse> getOrders(Long customerId) {
        List<CustomerOrder> orders = orderRepository.findByCustomerCustomerIdOrderByCreatedTimeDesc(customerId);
        return orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    // Address Management
    public List<AddressResponse> getCustomerAddresses(Long customerId) {
        return addressRepository.findByCustomerCustomerId(customerId).stream()
                .map(this::mapToAddressResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressResponse addAddress(Long customerId, AddressRequest request) {
        Customer customer = getCustomerEntity(customerId);
        Address address = new Address();
        address.setCustomer(customer);
        address.setTitle(request.getTitle());
        address.setAddressLine(request.getAddressLine());
        address.setLocality(request.getLocality());
        address.setCity(request.getCity());
        address.setPincode(request.getPincode());
        address.setLatitude(request.getLatitude());
        address.setLongitude(request.getLongitude());
        address.setIsDefault(request.getIsDefault() != null ? request.getIsDefault() : false);

        Address saved = addressRepository.save(address);
        return mapToAddressResponse(saved);
    }

    @Transactional
    public AddressResponse setDefaultAddress(Long addressId, Long customerId) {
        List<Address> customerAddresses = addressRepository.findByCustomerCustomerId(customerId);
        Address targetAddress = null;

        for (Address addr : customerAddresses) {
            if (addr.getAddressId().equals(addressId)) {
                addr.setIsDefault(true);
                targetAddress = addr;
            } else {
                addr.setIsDefault(false);
            }
            addressRepository.save(addr);
        }

        if (targetAddress == null) {
            throw new ResourceNotFoundException("Address not found with id: " + addressId);
        }

        Customer customer = getCustomerEntity(customerId);
        customer.setCustomerAddress(targetAddress.getFormattedAddress());
        customerRepository.save(customer);

        return mapToAddressResponse(targetAddress);
    }

    @Transactional
    public void deleteAddress(Long addressId, Long customerId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));
        if (!address.getCustomer().getCustomerId().equals(customerId)) {
            throw new ResourceNotFoundException("Address does not belong to customer");
        }
        addressRepository.delete(address);
    }

    private AddressResponse mapToAddressResponse(Address a) {
        return new AddressResponse(
                a.getAddressId(),
                a.getTitle(),
                a.getAddressLine(),
                a.getLocality(),
                a.getCity(),
                a.getPincode(),
                a.getLatitude(),
                a.getLongitude(),
                a.getIsDefault(),
                a.getFormattedAddress()
        );
    }

    public OrderResponse mapToOrderResponse(CustomerOrder order) {
        OrderResponse dto = new OrderResponse();
        dto.setOrderId(order.getOrderId());
        if (order.getCustomer() != null) {
            dto.setCustomerId(order.getCustomer().getCustomerId());
            dto.setCustomerName(order.getCustomer().getCustomerName());
            dto.setCustomerEmail(order.getCustomer().getCustomerEmail());
            dto.setCustomerPhone(order.getCustomer().getCustomerPhoneNumber());
        }
        if (order.getPartner() != null) {
            dto.setPartnerId(order.getPartner().getPartnerId());
            dto.setPartnerName(order.getPartner().getPartnerName());
            dto.setPartnerPhone(order.getPartner().getPhoneNumber());
            dto.setPartnerRating(order.getPartner().getRating());
        }
        dto.setStatus(order.getStatus());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setCustomerArea(order.getCustomerArea());
        dto.setCustomerPhone(order.getCustomerPhone() != null ? order.getCustomerPhone() : (order.getCustomer() != null ? order.getCustomer().getCustomerPhoneNumber() : ""));
        dto.setPartnerNotes(order.getPartnerNotes());
        dto.setEstimatedTotal(order.getEstimatedTotal());
        dto.setDeliveryFee(order.getDeliveryFee());
        dto.setPlatformFee(order.getPlatformFee());
        dto.setGrandTotal(order.getGrandTotal());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setPaymentId(order.getPaymentId());
        dto.setCreatedTime(order.getCreatedTime());
        dto.setUpdatedTime(order.getUpdatedTime());

        if (order.getItems() != null) {
            List<ItemResponse> itemDtos = order.getItems().stream().map(i -> new ItemResponse(
                    i.getItemId(),
                    i.getItemName(),
                    i.getItemQuantity(),
                    i.getUnit(),
                    i.getItemPrice(),
                    i.getNotes(),
                    i.getIsPurchased(),
                    i.getTotalPrice()
            )).collect(Collectors.toList());
            dto.setItems(itemDtos);
        }

        return dto;
    }
}
