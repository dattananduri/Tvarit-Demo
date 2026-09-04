package com.datta.tvaritfinal.repository;

import com.datta.tvaritfinal.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByOrderId(Long orderId);
    boolean existsByOrderId(Long orderId);
    List<Review> findByPartnerIdOrderByCreatedTimeDesc(Long partnerId);
    List<Review> findByCustomerIdOrderByCreatedTimeDesc(Long customerId);
    List<Review> findAllByOrderByCreatedTimeDesc();
}
