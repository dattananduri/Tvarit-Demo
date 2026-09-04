package com.datta.tvaritfinal.dto;

public class ItemResponse {
    private Long itemId;
    private String itemName;
    private Integer itemQuantity;
    private String unit;
    private Double itemPrice;
    private String notes;
    private Boolean isPurchased;
    private Double totalPrice;

    public ItemResponse() {}

    public ItemResponse(Long itemId, String itemName, Integer itemQuantity, String unit, Double itemPrice, String notes, Boolean isPurchased, Double totalPrice) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemQuantity = itemQuantity;
        this.unit = unit;
        this.itemPrice = itemPrice;
        this.notes = notes;
        this.isPurchased = isPurchased;
        this.totalPrice = totalPrice;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public Integer getItemQuantity() {
        return itemQuantity;
    }

    public void setItemQuantity(Integer itemQuantity) {
        this.itemQuantity = itemQuantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Double getItemPrice() {
        return itemPrice;
    }

    public void setItemPrice(Double itemPrice) {
        this.itemPrice = itemPrice;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Boolean getIsPurchased() {
        return isPurchased;
    }

    public void setIsPurchased(Boolean isPurchased) {
        this.isPurchased = isPurchased;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }
}
