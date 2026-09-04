package com.datta.tvaritfinal.service;

import com.datta.tvaritfinal.dto.ReviewRequest;
import com.datta.tvaritfinal.dto.ReviewResponse;
import com.datta.tvaritfinal.entity.CustomerOrder;
import com.datta.tvaritfinal.entity.OrderStatus;
import com.datta.tvaritfinal.entity.Partner;
import com.datta.tvaritfinal.entity.Review;
import com.datta.tvaritfinal.exception.DuplicateResourceException;
import com.datta.tvaritfinal.exception.InvalidOrderException;
import com.datta.tvaritfinal.exception.ResourceNotFoundException;
import com.datta.tvaritfinal.exception.UnauthorizedException;
import com.datta.tvaritfinal.repository.OrderRepository;
import com.datta.tvaritfinal.repository.PartnerRepository;
import com.datta.tvaritfinal.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final PartnerRepository partnerRepository;
    private final NotificationService notificationService;

    public ReviewService(ReviewRepository reviewRepository,
                         OrderRepository orderRepository,
                         PartnerRepository partnerRepository,
                         NotificationService notificationService) {
        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
        this.partnerRepository = partnerRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public ReviewResponse submitReview(Long customerId, Long orderId, ReviewRequest request) {
        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (order.getCustomer() == null || !order.getCustomer().getCustomerId().equals(customerId)) {
            throw new UnauthorizedException("You can only review your own orders");
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new InvalidOrderException("Reviews can only be submitted after order is DELIVERED");
        }

        if (reviewRepository.existsByOrderId(orderId)) {
            throw new DuplicateResourceException("A review has already been submitted for Order #" + orderId);
        }

        Long partnerId = order.getPartner() != null ? order.getPartner().getPartnerId() : null;
        String customerName = order.getCustomer().getCustomerName();

        Review review = new Review(
                orderId,
                customerId,
                customerName,
                partnerId,
                request.getRating(),
                request.getComment()
        );

        Review saved = reviewRepository.save(review);

        // Update partner rating if partner is assigned
        if (partnerId != null) {
            Partner partner = partnerRepository.findById(partnerId).orElse(null);
            if (partner != null) {
                List<Review> partnerReviews = reviewRepository.findByPartnerIdOrderByCreatedTimeDesc(partnerId);
                double avg = partnerReviews.stream()
                        .mapToInt(Review::getRating)
                        .average()
                        .orElse(5.0);
                double rounded = BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP).doubleValue();
                partner.setRating(rounded);
                partnerRepository.save(partner);

                notificationService.createNotification(
                        partnerId,
                        "ROLE_PARTNER",
                        orderId,
                        "New Customer Rating (" + request.getRating() + "★)",
                        customerName + " rated your delivery: \"" + (request.getComment() != null ? request.getComment() : "Great service!") + "\"",
                        "REVIEW_RECEIVED"
                );
            }
        }

        return mapToReviewResponse(saved);
    }

    public Optional<ReviewResponse> getReviewForOrder(Long orderId) {
        return reviewRepository.findByOrderId(orderId).map(this::mapToReviewResponse);
    }

    public List<ReviewResponse> getPartnerReviews(Long partnerId) {
        return reviewRepository.findByPartnerIdOrderByCreatedTimeDesc(partnerId).stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedTimeDesc().stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    private ReviewResponse mapToReviewResponse(Review r) {
        return new ReviewResponse(
                r.getReviewId(),
                r.getOrderId(),
                r.getCustomerId(),
                r.getCustomerName(),
                r.getPartnerId(),
                r.getRating(),
                r.getComment(),
                r.getCreatedTime()
        );
    }
}
