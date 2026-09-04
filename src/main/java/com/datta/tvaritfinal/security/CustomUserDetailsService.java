package com.datta.tvaritfinal.security;

import com.datta.tvaritfinal.entity.Customer;
import com.datta.tvaritfinal.entity.Partner;
import com.datta.tvaritfinal.repository.CustomerRepository;
import com.datta.tvaritfinal.repository.PartnerRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;
    private final PartnerRepository partnerRepository;

    public CustomUserDetailsService(CustomerRepository customerRepository, PartnerRepository partnerRepository) {
        this.customerRepository = customerRepository;
        this.partnerRepository = partnerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Check if Customer
        Optional<Customer> customerOpt = customerRepository.findByCustomerEmail(email);
        if (customerOpt.isPresent()) {
            Customer c = customerOpt.get();
            return new UserPrincipal(c.getCustomerId(), c.getCustomerEmail(), c.getCustomerName(), c.getPassword(), c.getRole());
        }

        // 2. Check if Partner
        Optional<Partner> partnerOpt = partnerRepository.findByPartnerEmail(email);
        if (partnerOpt.isPresent()) {
            Partner p = partnerOpt.get();
            return new UserPrincipal(p.getPartnerId(), p.getPartnerEmail(), p.getPartnerName(), p.getPassword(), p.getRole());
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
