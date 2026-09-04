package com.datta.tvaritfinal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "partners")
public class Partner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long partnerId;

    @Column(nullable = false)
    private String partnerName;

    @Column(unique = true, nullable = false)
    private String partnerEmail;

    private String phoneNumber;

    @Column(nullable = false)
    private String password;

    private String role = "ROLE_PARTNER";

    private Boolean isOnline = true;

    private Double rating = 4.9;

    private Double totalEarnings = 0.0;

    private Integer completedOrdersCount = 0;

    private LocalDateTime createdTime;

    @OneToMany(mappedBy = "partner")
    @JsonIgnore
    private List<CustomerOrder> assignedOrders = new ArrayList<>();

    public Partner() {
        this.createdTime = LocalDateTime.now();
        this.role = "ROLE_PARTNER";
        this.isOnline = true;
        this.rating = 4.9;
        this.totalEarnings = 0.0;
        this.completedOrdersCount = 0;
    }

    public Partner(Long partnerId, String partnerName, String partnerEmail, String phoneNumber, String password, LocalDateTime createdTime) {
        this.partnerId = partnerId;
        this.partnerName = partnerName;
        this.partnerEmail = partnerEmail;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.createdTime = createdTime != null ? createdTime : LocalDateTime.now();
        this.role = "ROLE_PARTNER";
        this.isOnline = true;
        this.rating = 4.9;
        this.totalEarnings = 0.0;
        this.completedOrdersCount = 0;
    }

    @PrePersist
    public void prePersist() {
        if (this.createdTime == null) {
            this.createdTime = LocalDateTime.now();
        }
        if (this.role == null) {
            this.role = "ROLE_PARTNER";
        }
        if (this.isOnline == null) {
            this.isOnline = true;
        }
        if (this.rating == null) {
            this.rating = 4.9;
        }
        if (this.totalEarnings == null) {
            this.totalEarnings = 0.0;
        }
        if (this.completedOrdersCount == null) {
            this.completedOrdersCount = 0;
        }
    }

    public Long getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(Long partnerId) {
        this.partnerId = partnerId;
    }

    public String getPartnerName() {
        return partnerName;
    }

    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

    public String getPartnerEmail() {
        return partnerEmail;
    }

    public void setPartnerEmail(String partnerEmail) {
        this.partnerEmail = partnerEmail;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getIsOnline() {
        return isOnline;
    }

    public void setIsOnline(Boolean isOnline) {
        this.isOnline = isOnline;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Double getTotalEarnings() {
        return totalEarnings;
    }

    public void setTotalEarnings(Double totalEarnings) {
        this.totalEarnings = totalEarnings;
    }

    public Integer getCompletedOrdersCount() {
        return completedOrdersCount;
    }

    public void setCompletedOrdersCount(Integer completedOrdersCount) {
        this.completedOrdersCount = completedOrdersCount;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }

    public List<CustomerOrder> getAssignedOrders() {
        return assignedOrders;
    }

    public void setAssignedOrders(List<CustomerOrder> assignedOrders) {
        this.assignedOrders = assignedOrders;
    }
}
