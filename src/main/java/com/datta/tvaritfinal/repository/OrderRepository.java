package com.datta.tvaritfinal.repository;

import com.datta.tvaritfinal.entity.CustomerOrder;
import com.datta.tvaritfinal.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {
    List<CustomerOrder> findByCustomerCustomerIdOrderByCreatedTimeDesc(Long customerId);
    List<CustomerOrder> findByPartnerPartnerIdOrderByCreatedTimeDesc(Long partnerId);
    List<CustomerOrder> findByStatusOrderByCreatedTimeDesc(OrderStatus status);
    List<CustomerOrder> findByStatusInOrderByCreatedTimeDesc(List<OrderStatus> statuses);
    List<CustomerOrder> findAllByOrderByCreatedTimeDesc();
    long countByStatus(OrderStatus status);
}