package com.datta.tvaritfinal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ItemRequest {

    @NotBlank(message = "Item name cannot be blank")
    private String itemName;

    @NotNull(message = "Quantity cannot be null")
    @Positive(message = "Quantity must be greater than zero")
    private Integer itemQuantity;

    private String unit = "unit";

    private Double itemPrice;

    private String notes;

    public ItemRequest() {}

    public ItemRequest(String itemName, Integer itemQuantity, String unit, Double itemPrice, String notes) {
        this.itemName = itemName;
        this.itemQuantity = itemQuantity;
        this.unit = unit;
        this.itemPrice = itemPrice;
        this.notes = notes;
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
}
