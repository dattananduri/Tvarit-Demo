package com.datta.tvaritfinal.dto;

public class AdminStatsResponse {
    private long totalCustomers;
    private long totalPartners;
    private long onlinePartners;
    private long totalOrders;
    private long activeOrders;
    private long completedOrders;
    private long cancelledOrders;
    private double grossOrderValue;

    public AdminStatsResponse() {}

    public AdminStatsResponse(long totalCustomers, long totalPartners, long onlinePartners, long totalOrders, long activeOrders, long completedOrders, long cancelledOrders, double grossOrderValue) {
        this.totalCustomers = totalCustomers;
        this.totalPartners = totalPartners;
        this.onlinePartners = onlinePartners;
        this.totalOrders = totalOrders;
        this.activeOrders = activeOrders;
        this.completedOrders = completedOrders;
        this.cancelledOrders = cancelledOrders;
        this.grossOrderValue = grossOrderValue;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalPartners() {
        return totalPartners;
    }

    public void setTotalPartners(long totalPartners) {
        this.totalPartners = totalPartners;
    }

    public long getOnlinePartners() {
        return onlinePartners;
    }

    public void setOnlinePartners(long onlinePartners) {
        this.onlinePartners = onlinePartners;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getActiveOrders() {
        return activeOrders;
    }

    public void setActiveOrders(long activeOrders) {
        this.activeOrders = activeOrders;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public double getGrossOrderValue() {
        return grossOrderValue;
    }

    public void setGrossOrderValue(double grossOrderValue) {
        this.grossOrderValue = grossOrderValue;
    }
}
