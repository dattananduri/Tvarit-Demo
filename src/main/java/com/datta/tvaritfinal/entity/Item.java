package com.datta.tvaritfinal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @Column(nullable = false)
    private String itemName;

    private Integer itemQuantity = 1;

    private String unit = "unit";

    private Double itemPrice = 0.0;

    private String notes;

    private Boolean isPurchased = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private CustomerOrder order;

    public Item() {}

    public Item(Long itemId, String itemName, Integer itemQuantity, String unit, Double itemPrice, String notes) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemQuantity = itemQuantity != null ? itemQuantity : 1;
        this.unit = unit != null ? unit : "unit";
        this.itemPrice = itemPrice != null ? itemPrice : 0.0;
        this.notes = notes;
        this.isPurchased = false;
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

    public CustomerOrder getOrder() {
        return order;
    }

    public void setOrder(CustomerOrder order) {
        this.order = order;
    }

    public Double getTotalPrice() {
        if (itemQuantity == null || itemPrice == null) {
            return 0.0;
        }
        return itemQuantity * itemPrice;
    }
}
