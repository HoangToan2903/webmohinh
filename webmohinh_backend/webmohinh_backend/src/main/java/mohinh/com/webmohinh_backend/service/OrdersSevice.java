package mohinh.com.webmohinh_backend.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.dto.OrderDTO;
import mohinh.com.webmohinh_backend.dto.OrderItemDTO;
import mohinh.com.webmohinh_backend.entity.Order_items;
import mohinh.com.webmohinh_backend.entity.Orders;
import mohinh.com.webmohinh_backend.entity.Producer;
import mohinh.com.webmohinh_backend.entity.Products;
import mohinh.com.webmohinh_backend.repository.Order_itemsRepository;
import mohinh.com.webmohinh_backend.repository.OrdersRepository;
import mohinh.com.webmohinh_backend.repository.ProductsRepository;
import mohinh.com.webmohinh_backend.repository.VoucherRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OrdersSevice {

    OrdersRepository ordersRepository;
    Order_itemsRepository order_itemsRepository;
    ProductsRepository productsRepository;
    VoucherRepository voucherRepository;


    private String generateOrderCode() {
        String prefix = "ORD";

        // Lấy ngày hiện tại dưới dạng yyyyMMdd
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        // Tạo chuỗi random 6 ký tự (chữ + số)
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder randomPart = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            randomPart.append(characters.charAt(random.nextInt(characters.length())));
        }

        return prefix + "-" + datePart + "-" + randomPart;
    }
    @Transactional
    public Orders createOrder(OrderDTO request) {
        Orders order = new Orders();
        order.setName(request.getName());
        order.setEmail(request.getEmail());
        order.setShipping_address(request.getShippingAddress());
        order.setPhone(request.getPhone());
        order.setNotes(request.getNotes());
        order.setPayment_method(request.getPaymentMethod());
        order.setShip_money(request.getShipMoney().toString());
        order.setTotal_price(request.getTotalPrice());

        // ✅ Dùng equals thay vì ==
        if ("Thanh toán khi nhận hàng".equals(request.getPaymentMethod())) {
            order.setStatus(0); // COD
        } else {
            order.setStatus(1); // Đã thanh toán online
        }

        order.setCreatedAt(LocalDateTime.now());
        order.setCodeOrder(request.getCodeOrder() != null ? request.getCodeOrder() : generateOrderCode());

        if (request.getVoucherId() != null) {
            voucherRepository.findById(request.getVoucherId())
                    .ifPresent(order::setVoucher);
        }

        Orders savedOrder = ordersRepository.save(order);

        List<Order_items> orderItems = new ArrayList<>();
        for (OrderItemDTO itemReq : request.getItems()) {
            Products product = productsRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));

            Order_items orderItem = new Order_items();
            orderItem.setOrders(savedOrder);
            orderItem.setProducts(product);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(itemReq.getPrice());
            orderItems.add(orderItem);
        }

        order_itemsRepository.saveAll(orderItems);

        return savedOrder;
    }


    public OrderDTO getOrderByCode(String codeOrder) {
        Orders order = ordersRepository.findByCodeOrder(codeOrder)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        // Chuyển danh sách sản phẩm sang DTO gọn gàng
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getProducts().getName(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .collect(Collectors.toList());

        // Trả về OrderDTO đầy đủ, KHÔNG chứa vòng lặp entity
        OrderDTO dto = new OrderDTO();
        dto.setCodeOrder(order.getCodeOrder());
        dto.setName(order.getName());
        dto.setEmail(order.getEmail());
        dto.setPhone(order.getPhone());
        dto.setShippingAddress(order.getShipping_address());
        dto.setNotes(order.getNotes());
        dto.setPaymentMethod(order.getPayment_method());
        dto.setShipMoney(new BigDecimal(order.getShip_money()));
        dto.setTotalPrice(order.getTotal_price());
        dto.setVoucherId(
                order.getVoucher() != null ? order.getVoucher().getId() : null
        );

        dto.setItems(itemDTOs);

        return dto;
    }


}

