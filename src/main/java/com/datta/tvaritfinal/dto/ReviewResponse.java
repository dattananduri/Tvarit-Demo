package com.datta.tvaritfinal.dto;

import java.time.LocalDateTime;

public class ReviewResponse {

    private Long reviewId;
    private Long orderId;
    private Long customerId;
    private String customerName;
    private Long partnerId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdTime;

    public ReviewResponse() {}

    public ReviewResponse(Long reviewId, Long orderId, Long customerId, String customerName, Long partnerId, Integer rating, String comment, LocalDateTime createdTime) {
        this.reviewId = reviewId;
        this.orderId = orderId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.partnerId = partnerId;
        this.rating = rating;
        this.comment = comment;
        this.createdTime = createdTime;
    }

    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Long getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(Long partnerId) {
        this.partnerId = partnerId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }
}
