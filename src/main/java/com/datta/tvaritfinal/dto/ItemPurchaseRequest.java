package com.datta.tvaritfinal.dto;

import jakarta.validation.constraints.NotNull;

public class ItemPurchaseRequest {

    @NotNull(message = "isPurchased cannot be null")
    private Boolean isPurchased;

    public ItemPurchaseRequest() {}

    public ItemPurchaseRequest(Boolean isPurchased) {
        this.isPurchased = isPurchased;
    }

    public Boolean getIsPurchased() {
        return isPurchased;
    }

    public void setIsPurchased(Boolean isPurchased) {
        this.isPurchased = isPurchased;
    }
}
