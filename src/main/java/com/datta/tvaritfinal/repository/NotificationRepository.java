package com.datta.tvaritfinal.repository;

import com.datta.tvaritfinal.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdAndRecipientRoleOrderByCreatedTimeDesc(Long recipientId, String recipientRole);
    long countByRecipientIdAndRecipientRoleAndIsReadFalse(Long recipientId, String recipientRole);
}
