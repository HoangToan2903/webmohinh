package mohinh.com.webmohinh_backend.service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.dto.OrderDTO;
import mohinh.com.webmohinh_backend.dto.OrderItemDTO;
import mohinh.com.webmohinh_backend.entity.*;
import mohinh.com.webmohinh_backend.repository.*;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
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
    UsersRepository usersRepository;

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
        order.setShip_money(request.getShipMoney());
        order.setTotal_price(request.getTotalPrice());
        if (request.getSource() != null) {
            order.setSource(OrderSource.valueOf(request.getSource().toUpperCase()));
        }
        Users user = usersRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        order.setUser(user);

        // ✅ Dùng equals thay vì ==
        if (request.getStatus() == null) {
            // Nếu status null, dựa vào phương thức thanh toán để set status mặc định
            if ("Thanh toán khi nhận hàng".equals(request.getPaymentMethod())) {
                order.setStatus(0); // COD
            } else {
                order.setStatus(1); // Đã thanh toán online
            }
        } else {
            // Nếu status đã có giá trị, gán giá trị đó cho order
            order.setStatus(request.getStatus());
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
            if (product.getQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ số lượng trong kho!");
            }
            product.setQuantity(product.getQuantity() - itemReq.getQuantity());
            productsRepository.save(product);
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
                        item.getProducts().getId(),
                        item.getProducts().getName(),
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
        dto.setShipMoney(order.getShip_money());
        dto.setTotalPrice(order.getTotal_price());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setVoucherId(
                order.getVoucher() != null ? order.getVoucher().getId() : null
        );

        dto.setItems(itemDTOs);

        return dto;
    }

    public List<OrderDTO> getOrdersByIdUsers(String idUsers) {
        // Giả sử anh tìm đơn hàng theo trường 'name' hoặc 'email' là username
        List<Orders> orders = ordersRepository.findByUserIdOrderByCreatedAtDesc(idUsers);

        return orders.stream().map(order -> {
            return OrderDTO.builder()
                    .codeOrder(order.getCodeOrder())
                    .id(order.getId())
                    .name(order.getName())
                    .email(order.getEmail())
                    .shippingAddress(order.getShipping_address()) // Map đúng shipping_address
                    .phone(order.getPhone())
                    .notes(order.getNotes())
                    .paymentMethod(order.getPayment_method())
                    .shipMoney(order.getShip_money()) // Fix lỗi đỏ shipMoney
                    .createdAt(order.getCreatedAt())
                    .totalPrice(order.getTotal_price())
                    .status(order.getStatus())
                    .voucherId(order.getVoucher() != null ? order.getVoucher().getId() : null)
                    .voucherDiscount(order.getVoucher() != null ? order.getVoucher().getReduced_value(): null) // Lấy % giảm giá
                    .items(order.getOrderItems().stream().map(item -> {
                        // Lấy ảnh từ Products -> List<ProductImage>
                        String imgUrl = "";
                        if (item.getProducts() != null && item.getProducts().getImages() != null
                                && !item.getProducts().getImages().isEmpty()) {
                            imgUrl = item.getProducts().getImages().get(0).getImageUrl();
                        }

                        return OrderItemDTO.builder()
                                .productName(item.getProducts().getName())
                                .price(item.getPrice())
                                .quantity(item.getQuantity())
                                .images(imgUrl) // Đảm bảo OrderItemDTO có trường String image
                                .build();
                    }).collect(Collectors.toList()))
                    .build();
        }).collect(Collectors.toList());
    }

    public void updateStatusOrder(String id, Integer status) {
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        System.out.println("tôi là: " + order);
        // Chỉ cho phép hủy khi đơn đang ở trạng thái 'Chờ xác nhận' (status = 0)
            order.setStatus(status);
            ordersRepository.save(order);
    }
    @Transactional
    public void updateMultipleStatusOrder(List<String> ids, Integer status) {
        // Nếu ID trong DB là kiểu Long, hãy đổi List<String> thành List<Long> ở tham số
        List<Orders> orders = ordersRepository.findAllById(ids);

        if (orders.isEmpty()) {
            throw new RuntimeException("Không tìm thấy đơn hàng nào với các ID: " + ids);
        }

        for (Orders order : orders) {
            order.setStatus(status);
        }
        // Không nhất thiết phải saveAll nếu có @Transactional và orders là managed entities,
        // nhưng để chắc chắn bạn giữ nguyên cũng được.
        ordersRepository.saveAll(orders);
    }
    public Page<OrderDTO> getAllOrdersForAdmin(int page, int size, Integer status, LocalDate date, String source) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        // Chuyển String từ Frontend thành Enum của Backend trước khi truyền vào Repository
        OrderSource sourceParam = (source == null || "ALL".equals(source))
                ? null
                : OrderSource.valueOf(source.toUpperCase());
        Page<Orders> ordersPage = ordersRepository.findByAdminFilters(status, startOfDay, endOfDay, sourceParam, pageable);
        return ordersPage.map(this::mapToOrderDTO);
    }
    private OrderDTO mapToOrderDTO(Orders order) {
        return OrderDTO.builder()
                .codeOrder(order.getCodeOrder())
                .id(order.getId())
                .name(order.getName())
                .email(order.getEmail())
                .phone(order.getPhone())
                .shippingAddress(order.getShipping_address())
                .notes(order.getNotes())
                .paymentMethod(order.getPayment_method())
                .shipMoney(order.getShip_money()) // BigDecimal từ Entity
                .createdAt(order.getCreatedAt())
                .totalPrice(order.getTotal_price())
                .status(order.getStatus())
                .source(order.getSource() != null ? order.getSource().name() : null)
                .voucherId(order.getVoucher() != null ? order.getVoucher().getId() : null)
                // Lấy % giảm giá từ Voucher nếu có
                .voucherDiscount(order.getVoucher() != null ? order.getVoucher().getReduced_value() : 0)
                .userName(order.getUser() != null ? order.getUser().getUsername() : "")

                // Ánh xạ danh sách sản phẩm OrderItemDTO
                .items(order.getOrderItems().stream().map(item -> {
                    // Logic lấy ảnh đầu tiên từ Cloudinary
                    String imgUrl = "";
                    if (item.getProducts() != null && item.getProducts().getImages() != null
                            && !item.getProducts().getImages().isEmpty()) {
                        imgUrl = item.getProducts().getImages().get(0).getImageUrl();
                    }

                    return OrderItemDTO.builder()
                            .productName(item.getProducts().getName())
                            .price(item.getPrice())
                            .quantity(item.getQuantity())
                            .images(imgUrl)
                            .build();
                }).collect(Collectors.toList()))
                .build();
    }
    // Lấy số lượng đếm
    public Map<Integer, Long> getCounts(LocalDate date, String source) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        OrderSource sourceParam = (source == null || "ALL".equals(source))
                ? null
                : OrderSource.valueOf(source.toUpperCase());

        List<Object[]> results = ordersRepository.countByStatusAndDate(startOfDay, endOfDay, sourceParam);

        Map<Integer, Long> counts = new HashMap<>();
        for (int i = 0; i <= 3; i++) counts.put(i, 0L);

        for (Object[] row : results) {
            counts.put((Integer) row[0], (Long) row[1]);
        }
        return counts;
    }
}

