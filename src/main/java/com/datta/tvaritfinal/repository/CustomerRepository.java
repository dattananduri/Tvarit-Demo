package com.datta.tvaritfinal.repository;

import com.datta.tvaritfinal.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByCustomerEmail(String customerEmail);
    boolean existsByCustomerEmail(String customerEmail);
}
