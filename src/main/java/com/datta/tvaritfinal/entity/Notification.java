package com.datta.tvaritfinal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long recipientId;

    private String recipientRole; // ROLE_CUSTOMER, ROLE_PARTNER

    private Long orderId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    private String type; // ORDER_ACCEPTED, SHOPPING_STARTED, PICKED_UP, OUT_FOR_DELIVERY, DELIVERED, SYSTEM

    private Boolean isRead = false;

    private LocalDateTime createdTime;

    public Notification() {
        this.createdTime = LocalDateTime.now();
        this.isRead = false;
    }

    public Notification(Long recipientId, String recipientRole, Long orderId, String title, String message, String type) {
        this.recipientId = recipientId;
        this.recipientRole = recipientRole;
        this.orderId = orderId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.isRead = false;
        this.createdTime = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public String getRecipientRole() {
        return recipientRole;
    }

    public void setRecipientRole(String recipientRole) {
        this.recipientRole = recipientRole;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }
}
