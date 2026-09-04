package com.datta.tvaritfinal;

import com.datta.tvaritfinal.dto.ItemRequest;
import com.datta.tvaritfinal.entity.Notification;
import com.datta.tvaritfinal.service.AiService;
import com.datta.tvaritfinal.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class AiAndNotificationTests {

    @Autowired
    private AiService aiService;

    @Autowired
    private NotificationService notificationService;

    @Test
    void testAskTvaritBiryaniQuery() {
        Map<String, Object> result = aiService.generateShoppingListFromPrompt("I want to make chicken biryani for 6 people");
        assertNotNull(result);
        assertTrue(result.containsKey("items"));

        @SuppressWarnings("unchecked")
        List<ItemRequest> items = (List<ItemRequest>) result.get("items");
        assertFalse(items.isEmpty());

        boolean hasChicken = items.stream().anyMatch(i -> i.getItemName().toLowerCase().contains("chicken"));
        boolean hasRice = items.stream().anyMatch(i -> i.getItemName().toLowerCase().contains("rice"));
        assertTrue(hasChicken, "Should include chicken");
        assertTrue(hasRice, "Should include basmati rice");
    }

    @Test
    void testSnapAndShopCakeImageAnalysis() {
        Map<String, Object> result = aiService.analyzeImageToShoppingList("data:image/jpeg;base64,sample", "chocolate_cake.jpg");
        assertNotNull(result);
        assertEquals("Fresh Chocolate Fudge Cake", result.get("identifiedSubject"));

        @SuppressWarnings("unchecked")
        List<ItemRequest> items = (List<ItemRequest>) result.get("items");
        assertFalse(items.isEmpty());
        assertTrue(items.stream().anyMatch(i -> i.getItemName().toLowerCase().contains("cocoa") || i.getItemName().toLowerCase().contains("flour")));
    }

    @Test
    void testVoiceParsingToStructuredItems() {
        Map<String, Object> result = aiService.parseVoiceTranscriptToItems("I need two litres milk, one bread and twelve eggs");
        assertNotNull(result);

        @SuppressWarnings("unchecked")
        List<ItemRequest> items = (List<ItemRequest>) result.get("items");
        assertEquals(3, items.size());

        ItemRequest milk = items.stream().filter(i -> i.getItemName().toLowerCase().contains("milk")).findFirst().orElse(null);
        assertNotNull(milk);
        assertEquals(2, milk.getItemQuantity());

        ItemRequest eggs = items.stream().filter(i -> i.getItemName().toLowerCase().contains("egg")).findFirst().orElse(null);
        assertNotNull(eggs);
        assertEquals(12, eggs.getItemQuantity());
    }

    @Test
    void testNotificationsLifecycle() {
        Notification n = notificationService.createNotification(
                1L,
                "ROLE_CUSTOMER",
                101L,
                "Test Title",
                "Your partner started shopping",
                "SHOPPING_STARTED"
        );
        assertNotNull(n.getId());
        assertFalse(n.getIsRead());

        List<Notification> list = notificationService.getNotificationsForUser(1L, "ROLE_CUSTOMER");
        assertFalse(list.isEmpty());

        long unread = notificationService.getUnreadCount(1L, "ROLE_CUSTOMER");
        assertTrue(unread >= 1);

        notificationService.markAsRead(n.getId());
        Notification updated = notificationService.getNotificationsForUser(1L, "ROLE_CUSTOMER").get(0);
        assertTrue(updated.getIsRead());
    }
}
