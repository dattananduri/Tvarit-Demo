package com.datta.tvaritfinal.repository;

import com.datta.tvaritfinal.entity.Partner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartnerRepository extends JpaRepository<Partner, Long> {
    Optional<Partner> findByPartnerEmail(String partnerEmail);
    boolean existsByPartnerEmail(String partnerEmail);
    List<Partner> findByIsOnlineTrue();
}