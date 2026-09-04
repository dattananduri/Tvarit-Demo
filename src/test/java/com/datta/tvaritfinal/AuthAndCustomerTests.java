package com.datta.tvaritfinal;

import com.datta.tvaritfinal.dto.AuthResponse;
import com.datta.tvaritfinal.dto.LoginRequest;
import com.datta.tvaritfinal.dto.RegisterCustomerRequest;
import com.datta.tvaritfinal.dto.RegisterPartnerRequest;
import com.datta.tvaritfinal.exception.DuplicateResourceException;
import com.datta.tvaritfinal.exception.UnauthorizedException;
import com.datta.tvaritfinal.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class AuthAndCustomerTests {

    @Autowired
    private AuthService authService;

    @Test
    void testCustomerRegistrationAndLogin() {
        String uniqueEmail = "testuser_" + UUID.randomUUID().toString().substring(0, 8) + "@tvarit.com";
        RegisterCustomerRequest registerReq = new RegisterCustomerRequest();
        registerReq.setCustomerName("Test Customer");
        registerReq.setCustomerEmail(uniqueEmail);
        registerReq.setCustomerPhoneNumber("9876500000");
        registerReq.setPassword("secret123");
        registerReq.setCustomerAddress("123 Test Street");

        AuthResponse regResponse = authService.registerCustomer(registerReq);
        assertNotNull(regResponse.getToken());
        assertEquals("ROLE_CUSTOMER", regResponse.getRole());
        assertEquals("Test Customer", regResponse.getName());

        // Test Login
        LoginRequest loginReq = new LoginRequest(uniqueEmail, "secret123");
        AuthResponse loginResponse = authService.loginCustomer(loginReq);
        assertNotNull(loginResponse.getToken());
        assertEquals(uniqueEmail, loginResponse.getEmail());
    }

    @Test
    void testDuplicateCustomerRegistrationFails() {
        String uniqueEmail = "dup_" + UUID.randomUUID().toString().substring(0, 8) + "@tvarit.com";
        RegisterCustomerRequest req = new RegisterCustomerRequest();
        req.setCustomerName("Duplicate Test");
        req.setCustomerEmail(uniqueEmail);
        req.setCustomerPhoneNumber("9876500001");
        req.setPassword("secret123");

        authService.registerCustomer(req);

        // Second registration must fail
        assertThrows(DuplicateResourceException.class, () -> {
            authService.registerCustomer(req);
        });
    }

    @Test
    void testInvalidCustomerPasswordFails() {
        String uniqueEmail = "wrongpass_" + UUID.randomUUID().toString().substring(0, 8) + "@tvarit.com";
        RegisterCustomerRequest req = new RegisterCustomerRequest();
        req.setCustomerName("Wrong Pass User");
        req.setCustomerEmail(uniqueEmail);
        req.setCustomerPhoneNumber("9876500002");
        req.setPassword("correctPassword");

        authService.registerCustomer(req);

        LoginRequest wrongLogin = new LoginRequest(uniqueEmail, "wrongPassword");
        assertThrows(UnauthorizedException.class, () -> {
            authService.loginCustomer(wrongLogin);
        });
    }

    @Test
    void testPartnerRegistrationAndLogin() {
        String uniqueEmail = "partner_" + UUID.randomUUID().toString().substring(0, 8) + "@tvarit.com";
        RegisterPartnerRequest req = new RegisterPartnerRequest();
        req.setPartnerName("Speedy Partner");
        req.setPartnerEmail(uniqueEmail);
        req.setPhoneNumber("9811000000");
        req.setPassword("partnerPass123");

        AuthResponse regRes = authService.registerPartner(req);
        assertNotNull(regRes.getToken());
        assertEquals("ROLE_PARTNER", regRes.getRole());
        assertTrue(regRes.getIsOnline());

        LoginRequest loginReq = new LoginRequest(uniqueEmail, "partnerPass123");
        AuthResponse loginRes = authService.loginPartner(loginReq);
        assertNotNull(loginRes.getToken());
        assertEquals(uniqueEmail, loginRes.getEmail());
    }

    @Test
    void testAdminLogin() {
        LoginRequest adminLogin = new LoginRequest("admin@tvarit.com", "admin123");
        AuthResponse adminRes = authService.loginAdmin(adminLogin);
        assertNotNull(adminRes.getToken());
        assertEquals("ROLE_ADMIN", adminRes.getRole());
    }
}
