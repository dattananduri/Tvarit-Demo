package com.datta.tvaritfinal.service;

import com.datta.tvaritfinal.entity.Notification;
import com.datta.tvaritfinal.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public Notification createNotification(Long recipientId, String recipientRole, Long orderId, String title, String message, String type) {
        Notification notification = new Notification(recipientId, recipientRole, orderId, title, message, type);
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(Long recipientId, String recipientRole) {
        return notificationRepository.findByRecipientIdAndRecipientRoleOrderByCreatedTimeDesc(recipientId, recipientRole);
    }

    public long getUnreadCount(Long recipientId, String recipientRole) {
        return notificationRepository.countByRecipientIdAndRecipientRoleAndIsReadFalse(recipientId, recipientRole);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(Long recipientId, String recipientRole) {
        List<Notification> list = notificationRepository.findByRecipientIdAndRecipientRoleOrderByCreatedTimeDesc(recipientId, recipientRole);
        for (Notification n : list) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(list);
    }
}
