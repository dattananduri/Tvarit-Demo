package com.datta.tvaritfinal.dto;

import jakarta.validation.constraints.NotBlank;

public class AddressRequest {

    private String title = "Home";

    @NotBlank(message = "Address line is required")
    private String addressLine;

    private String locality;
    private String city;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private Boolean isDefault = false;

    public AddressRequest() {}

    public AddressRequest(String title, String addressLine, String locality, String city, String pincode, Double latitude, Double longitude, Boolean isDefault) {
        this.title = title;
        this.addressLine = addressLine;
        this.locality = locality;
        this.city = city;
        this.pincode = pincode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.isDefault = isDefault;
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
}
