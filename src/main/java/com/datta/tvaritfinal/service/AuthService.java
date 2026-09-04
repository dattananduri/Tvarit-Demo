package com.datta.tvaritfinal.service;

import com.datta.tvaritfinal.dto.*;
import com.datta.tvaritfinal.entity.Customer;
import com.datta.tvaritfinal.entity.Partner;
import com.datta.tvaritfinal.exception.DuplicateResourceException;
import com.datta.tvaritfinal.exception.UnauthorizedException;
import com.datta.tvaritfinal.repository.CustomerRepository;
import com.datta.tvaritfinal.repository.PartnerRepository;
import com.datta.tvaritfinal.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final PartnerRepository partnerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(CustomerRepository customerRepository,
                       PartnerRepository partnerRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.customerRepository = customerRepository;
        this.partnerRepository = partnerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponse registerCustomer(RegisterCustomerRequest request) {
        if (customerRepository.existsByCustomerEmail(request.getCustomerEmail())) {
            throw new DuplicateResourceException("Customer email already registered: " + request.getCustomerEmail());
        }

        Customer customer = new Customer();
        customer.setCustomerName(request.getCustomerName().trim());
        customer.setCustomerEmail(request.getCustomerEmail().trim().toLowerCase());
        customer.setCustomerPhoneNumber(request.getCustomerPhoneNumber().trim());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setCustomerAddress(request.getCustomerAddress());
        customer.setRole("ROLE_CUSTOMER");
        customer.setCreatedTime(LocalDateTime.now());

        Customer saved = customerRepository.save(customer);
        String token = jwtUtils.generateToken(saved.getCustomerEmail(), saved.getRole(), saved.getCustomerId(), saved.getCustomerName());

        return new AuthResponse(
                token,
                saved.getCustomerId(),
                saved.getCustomerName(),
                saved.getCustomerEmail(),
                saved.getRole(),
                saved.getCustomerPhoneNumber(),
                saved.getCustomerAddress(),
                null
        );
    }

    @Transactional
    public AuthResponse registerPartner(RegisterPartnerRequest request) {
        if (partnerRepository.existsByPartnerEmail(request.getPartnerEmail())) {
            throw new DuplicateResourceException("Partner email already registered: " + request.getPartnerEmail());
        }

        Partner partner = new Partner();
        partner.setPartnerName(request.getPartnerName().trim());
        partner.setPartnerEmail(request.getPartnerEmail().trim().toLowerCase());
        partner.setPhoneNumber(request.getPhoneNumber().trim());
        partner.setPassword(passwordEncoder.encode(request.getPassword()));
        partner.setRole("ROLE_PARTNER");
        partner.setIsOnline(true);
        partner.setRating(4.9);
        partner.setTotalEarnings(0.0);
        partner.setCompletedOrdersCount(0);
        partner.setCreatedTime(LocalDateTime.now());

        Partner saved = partnerRepository.save(partner);
        String token = jwtUtils.generateToken(saved.getPartnerEmail(), saved.getRole(), saved.getPartnerId(), saved.getPartnerName());

        return new AuthResponse(
                token,
                saved.getPartnerId(),
                saved.getPartnerName(),
                saved.getPartnerEmail(),
                saved.getRole(),
                saved.getPhoneNumber(),
                null,
                saved.getIsOnline()
        );
    }

    public AuthResponse loginCustomer(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Customer customer = customerRepository.findByCustomerEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())
                && !customer.getPassword().equals(request.getPassword())) { // support plain text legacy match if any
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(customer.getCustomerEmail(), customer.getRole(), customer.getCustomerId(), customer.getCustomerName());
        return new AuthResponse(
                token,
                customer.getCustomerId(),
                customer.getCustomerName(),
                customer.getCustomerEmail(),
                customer.getRole(),
                customer.getCustomerPhoneNumber(),
                customer.getCustomerAddress(),
                null
        );
    }

    public AuthResponse loginPartner(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Partner partner = partnerRepository.findByPartnerEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), partner.getPassword())
                && !partner.getPassword().equals(request.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(partner.getPartnerEmail(), partner.getRole(), partner.getPartnerId(), partner.getPartnerName());
        return new AuthResponse(
                token,
                partner.getPartnerId(),
                partner.getPartnerName(),
                partner.getPartnerEmail(),
                partner.getRole(),
                partner.getPhoneNumber(),
                null,
                partner.getIsOnline()
        );
    }

    public AuthResponse loginAdmin(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        // Support admin credentials
        if ("admin@tvarit.com".equalsIgnoreCase(email) && "admin123".equals(request.getPassword())) {
            String token = jwtUtils.generateToken("admin@tvarit.com", "ROLE_ADMIN", 0L, "Tvarit Admin");
            return new AuthResponse(
                    token,
                    0L,
                    "Tvarit Admin",
                    "admin@tvarit.com",
                    "ROLE_ADMIN",
                    "+91 9999900000",
                    "Tvarit Headquarters",
                    true
            );
        }
        throw new UnauthorizedException("Invalid admin credentials");
    }
}
