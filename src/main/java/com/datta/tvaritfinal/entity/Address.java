package com.datta.tvaritfinal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @JsonIgnore
    private Customer customer;

    private String title; // Home, Work, Other
    private String addressLine;
    private String locality;
    private String city;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private Boolean isDefault = false;

    public Address() {}

    public Address(Long addressId, Customer customer, String title, String addressLine, String locality, String city, String pincode, Double latitude, Double longitude, Boolean isDefault) {
        this.addressId = addressId;
        this.customer = customer;
        this.title = title;
        this.addressLine = addressLine;
        this.locality = locality;
        this.city = city;
        this.pincode = pincode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.isDefault = isDefault;
    }

    public Long getAddressId() {
        return addressId;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAddressLine() {
        return addressLine;
    }

    public void setAddressLine(String addressLine) {
        this.addressLine = addressLine;
    }

    public String getLocality() {
        return locality;
    }

    public void setLocality(String locality) {
        this.locality = locality;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean aDefault) {
        isDefault = aDefault;
    }

    public String getFormattedAddress() {
        StringBuilder sb = new StringBuilder();
        if (addressLine != null && !addressLine.isBlank()) sb.append(addressLine).append(", ");
        if (locality != null && !locality.isBlank()) sb.append(locality).append(", ");
        if (city != null && !city.isBlank()) sb.append(city);
        if (pincode != null && !pincode.isBlank()) sb.append(" - ").append(pincode);
        return sb.toString();
    }
}
