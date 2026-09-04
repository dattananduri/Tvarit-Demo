package com.datta.tvaritfinal.dto;

import java.time.LocalDateTime;

public class PartnerProfileResponse {
    private Long partnerId;
    private String partnerName;
    private String partnerEmail;
    private String phoneNumber;
    private Boolean isOnline;
    private Double rating;
    private Double totalEarnings;
    private Integer completedOrdersCount;
    private String role;
    private LocalDateTime createdTime;

    public PartnerProfileResponse() {}

    public PartnerProfileResponse(Long partnerId, String partnerName, String partnerEmail, String phoneNumber, Boolean isOnline, Double rating, Double totalEarnings, Integer completedOrdersCount, String role, LocalDateTime createdTime) {
        this.partnerId = partnerId;
        this.partnerName = partnerName;
        this.partnerEmail = partnerEmail;
        this.phoneNumber = phoneNumber;
        this.isOnline = isOnline;
        this.rating = rating;
        this.totalEarnings = totalEarnings;
        this.completedOrdersCount = completedOrdersCount;
        this.role = role;
        this.createdTime = createdTime;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }
}
