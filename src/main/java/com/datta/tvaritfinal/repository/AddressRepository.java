package com.datta.tvaritfinal.repository;

import com.datta.tvaritfinal.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByCustomerCustomerId(Long customerId);
    Optional<Address> findByCustomerCustomerIdAndIsDefaultTrue(Long customerId);
}
