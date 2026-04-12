package com.example.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.Order;
import com.example.model.OrderItem;
import com.example.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(Order order) {
        // Calculate total price from items
        double totalPrice = 0;
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                totalPrice += item.getPrice() * item.getQuantity();
            }
        }

        // Set order details
        order.setStatus("CONFIRMED");
        order.setTotalPrice(totalPrice);
        order.setCreatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}