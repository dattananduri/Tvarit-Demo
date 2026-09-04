package com.datta.tvaritfinal.config;

import com.datta.tvaritfinal.entity.*;
import com.datta.tvaritfinal.repository.AddressRepository;
import com.datta.tvaritfinal.repository.CustomerRepository;
import com.datta.tvaritfinal.repository.OrderRepository;
import com.datta.tvaritfinal.repository.PartnerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final CustomerRepository customerRepository;
    private final PartnerRepository partnerRepository;
    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final com.datta.tvaritfinal.repository.ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(CustomerRepository customerRepository,
                      PartnerRepository partnerRepository,
                      OrderRepository orderRepository,
                      AddressRepository addressRepository,
                      com.datta.tvaritfinal.repository.ReviewRepository reviewRepository,
                      PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.partnerRepository = partnerRepository;
        this.orderRepository = orderRepository;
        this.addressRepository = addressRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (customerRepository.count() == 0 && partnerRepository.count() == 0) {
            logger.info("Initializing Tvarit sample development seed data...");

            // 1. Seed Customers
            Customer rahul = new Customer();
            rahul.setCustomerName("Rahul Sharma (Demo)");
            rahul.setCustomerEmail("rahul@tvarit.com");
            rahul.setCustomerPhoneNumber("+91 9876543210");
            rahul.setCustomerAddress("Flat 402, Green Meadows, MG Road, Ward 4");
            rahul.setPassword(passwordEncoder.encode("password123"));
            rahul.setRole("ROLE_CUSTOMER");
            rahul.setCreatedTime(LocalDateTime.now().minusDays(3));
            rahul = customerRepository.save(rahul);

            Customer priya = new Customer();
            priya.setCustomerName("Priya Patel (Demo)");
            priya.setCustomerEmail("priya@tvarit.com");
            priya.setCustomerPhoneNumber("+91 9876543211");
            priya.setCustomerAddress("18/B, Saraswathipuram 3rd Cross, Near Gandhi Square");
            priya.setPassword(passwordEncoder.encode("password123"));
            priya.setRole("ROLE_CUSTOMER");
            priya.setCreatedTime(LocalDateTime.now().minusDays(2));
            priya = customerRepository.save(priya);

            // 2. Seed Addresses
            Address rahulHome = new Address(null, rahul, "Home", "Flat 402, Green Meadows", "MG Road, Ward 4", "Mysore", "570001", 12.3051, 76.6552, true);
            Address rahulWork = new Address(null, rahul, "Work", "Tech Park Building 3", "Hebbal Industrial Area", "Mysore", "570016", 12.3551, 76.6152, false);
            addressRepository.save(rahulHome);
            addressRepository.save(rahulWork);

            // 3. Seed Partners
            Partner vikram = new Partner();
            vikram.setPartnerName("Vikram Singh (Demo Partner)");
            vikram.setPartnerEmail("vikram@tvarit.com");
            vikram.setPhoneNumber("+91 9811223344");
            vikram.setPassword(passwordEncoder.encode("partner123"));
            vikram.setRole("ROLE_PARTNER");
            vikram.setIsOnline(true);
            vikram.setRating(4.9);
            vikram.setTotalEarnings(320.0);
            vikram.setCompletedOrdersCount(8);
            vikram.setCreatedTime(LocalDateTime.now().minusDays(10));
            vikram = partnerRepository.save(vikram);

            Partner amit = new Partner();
            amit.setPartnerName("Amit Kumar (Demo Partner)");
            amit.setPartnerEmail("amit@tvarit.com");
            amit.setPhoneNumber("+91 9811223355");
            amit.setPassword(passwordEncoder.encode("partner123"));
            amit.setRole("ROLE_PARTNER");
            amit.setIsOnline(true);
            amit.setRating(4.8);
            amit.setTotalEarnings(160.0);
            amit.setCompletedOrdersCount(4);
            amit.setCreatedTime(LocalDateTime.now().minusDays(5));
            partnerRepository.save(amit);

            // 4. Seed Past Completed Order
            CustomerOrder pastOrder = new CustomerOrder();
            pastOrder.setCustomer(rahul);
            pastOrder.setPartner(vikram);
            pastOrder.setStatus(OrderStatus.DELIVERED);
            pastOrder.setDeliveryAddress(rahul.getCustomerAddress());
            pastOrder.setCustomerArea("MG Road");
            pastOrder.setCustomerPhone(rahul.getCustomerPhoneNumber());
            pastOrder.setPartnerNotes("Delivered at doorstep");
            pastOrder.setPaymentMethod("UPI");
            pastOrder.setPaymentStatus("PAID");
            pastOrder.setPaymentId("pay_demo_completed_001");
            pastOrder.setDeliveryFee(25.0);
            pastOrder.setPlatformFee(5.0);
            pastOrder.setCreatedTime(LocalDateTime.now().minusDays(1));
            pastOrder.setUpdatedTime(LocalDateTime.now().minusDays(1).plusMinutes(35));

            List<Item> pastItems = new ArrayList<>();
            pastItems.add(createItem("2 kg Rice", 2, "kg", 60.0, "Sona Masoori", true, pastOrder));
            pastItems.add(createItem("1 packet Sugar", 1, "packet", 45.0, "Refined white sugar", true, pastOrder));
            pastItems.add(createItem("2 Milk", 2, "packet", 30.0, "Nandini Blue Packet", true, pastOrder));
            pastItems.add(createItem("1 Bread", 1, "pack", 35.0, "Whole wheat bread", true, pastOrder));
            pastItems.add(createItem("12 Eggs", 12, "units", 7.0, "Fresh farm eggs", true, pastOrder));
            pastOrder.setItems(pastItems);
            pastOrder.recalculateTotals();
            CustomerOrder savedPastOrder = orderRepository.save(pastOrder);

            // Seed review for past completed order
            Review pastReview = new Review(
                    savedPastOrder.getOrderId(),
                    rahul.getCustomerId(),
                    rahul.getCustomerName(),
                    vikram.getPartnerId(),
                    5,
                    "Super fast delivery! Vikram picked fresh items from the local store and delivered on time."
            );
            reviewRepository.save(pastReview);

            // 5. Seed Available Order Ready for Partner acceptance test
            CustomerOrder newOrder = new CustomerOrder();
            newOrder.setCustomer(priya);
            newOrder.setStatus(OrderStatus.CREATED);
            newOrder.setDeliveryAddress(priya.getCustomerAddress());
            newOrder.setCustomerArea("Saraswathipuram");
            newOrder.setCustomerPhone(priya.getCustomerPhoneNumber());
            newOrder.setPartnerNotes("Need fresh vegetables. Ring bell twice.");
            newOrder.setPaymentMethod("TEST_PAYMENT");
            newOrder.setPaymentStatus("PAID");
            newOrder.setPaymentId("pay_demo_new_002");
            newOrder.setDeliveryFee(25.0);
            newOrder.setPlatformFee(5.0);
            newOrder.setCreatedTime(LocalDateTime.now().minusMinutes(12));
            newOrder.setUpdatedTime(LocalDateTime.now().minusMinutes(12));

            List<Item> newItems = new ArrayList<>();
            newItems.add(createItem("Atta 5kg", 1, "packet", 240.0, "Aashirvaad Shudh Chakki Atta", false, newOrder));
            newItems.add(createItem("Sunflower Oil 1L", 1, "packet", 140.0, "Fortune Sunlite", false, newOrder));
            newItems.add(createItem("Fresh Tomatoes", 1, "kg", 40.0, "Firm and red", false, newOrder));
            newItems.add(createItem("Ginger", 250, "g", 25.0, "Clean ginger", false, newOrder));
            newOrder.setItems(newItems);
            newOrder.recalculateTotals();
            orderRepository.save(newOrder);

            logger.info("Seed data initialization complete!");
        }
    }

    private Item createItem(String name, int qty, String unit, double price, String notes, boolean purchased, CustomerOrder order) {
        Item item = new Item();
        item.setItemName(name);
        item.setItemQuantity(qty);
        item.setUnit(unit);
        item.setItemPrice(price);
        item.setNotes(notes);
        item.setIsPurchased(purchased);
        item.setOrder(order);
        return item;
    }
}
