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

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OrdersSevice {

    OrdersRepository ordersRepository;
    Order_itemsRepository order_itemsRepository;
    ProductsRepository productsRepository;
    VoucherRepository voucherRepository;

//    public Orders addOrder(Orders orders) {
//
//        return ordersRepository.save(orders);
//    }
//
//    public Order_items addOrderItem(Order_items order_items) {
//
//        return order_itemsRepository.save(order_items);
//    }


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
        // Tạo đơn hàng mới
        Orders order = new Orders();
        order.setName(request.getName());
        order.setEmail(request.getEmail());
        order.setShipping_address(request.getShippingAddress());
        order.setPhone(request.getPhone());
        order.setNotes(request.getNotes());
        order.setPayment_method(request.getPaymentMethod());
        order.setShip_money(request.getShipMoney().toString());
        order.setTotal_price(request.getTotalPrice());
        order.setStatus(1); // 1 = mới tạo
        order.setCreatedAt(LocalDateTime.now());
        order.setCodeOrder(generateOrderCode());
        // Nếu có voucher
        if (request.getVoucherId() != null) {
            voucherRepository.findById(request.getVoucherId())
                    .ifPresent(order::setVoucher);
        }

        // Lưu đơn hàng
        Orders savedOrder = ordersRepository.save(order);

        // Tạo danh sách Order_items
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

        // Lưu danh sách item
        order_itemsRepository.saveAll(orderItems);

        return savedOrder;
    }
}

