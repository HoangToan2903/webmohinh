package mohinh.com.webmohinh_backend.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.dto.EmailRequest;
import mohinh.com.webmohinh_backend.dto.OrderDTO;
import mohinh.com.webmohinh_backend.dto.OrderItemDTO;
import mohinh.com.webmohinh_backend.entity.Orders;
import mohinh.com.webmohinh_backend.entity.Products;
import mohinh.com.webmohinh_backend.entity.Voucher;
import mohinh.com.webmohinh_backend.repository.ProductsRepository;
import mohinh.com.webmohinh_backend.service.EmailService;
import mohinh.com.webmohinh_backend.service.OrdersSevice;
import mohinh.com.webmohinh_backend.service.ProductsService;
import mohinh.com.webmohinh_backend.service.VoucherService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class OrdersController {

    OrdersSevice ordersSevice;
    EmailService emailService;
    ProductsService productsService;
    VoucherService voucherService;
    ProductsRepository productsRepository;
    @PostMapping("/orders")
    public ResponseEntity<?> createOrder( @RequestBody OrderDTO request, EmailRequest emailrequest) {

        try {
            NumberFormat currencyVN = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
            Orders newOrder = ordersSevice.createOrder(request);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            String productInfo = request.getItems()
                    .stream()
                    .map(item -> {
                        Products product = productsService.getProductById(item.getProductId())
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                        String name = product.getName();

                        int quantity = item.getQuantity();

                        return name + "(Số lương : " + quantity + " x " + currencyVN.format(product.getPrice()) + ")";
                    })
                    .collect(Collectors.joining("\n"));
            Voucher voucher = null;
            if (request.getVoucherId() != null) {
                try {
                    voucher = voucherService.findById(request.getVoucherId());
                } catch (Exception e) {
                    System.err.println("Không tìm thấy voucher: " + e.getMessage());
                }
            }

// Khởi tạo giá trị mặc định nếu không có voucher
            String reducedValueStr = (voucher != null) ? String.valueOf(voucher.getReduced_value()) : "0";

            // Tạo HTML email
            String emailBody =
                    "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Mã đơn hàng :</div>"
                            + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                            + newOrder.getCodeOrder() +
                            "</div>" + "<br>" +
                            "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Ngày mua :</div>"
                            + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                            + newOrder.getCreatedAt().format(formatter) +
                            "</div>" + "<br>" +
                            "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Sản phẩm :</div>"
                            + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                            + productInfo +
                            "</div>" + "<br>" +
                            "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Phí ship :</div>"
                            + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                            + currencyVN.format(request.getShipMoney()) +
                            "</div>"
                            + "<br>" +
                            "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Phần trăm giảm :</div>"
                            + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                            + reducedValueStr + "%" +
                            "</div>"
                            + "<br>" +
                            "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Tổng cộng :</div>"
                            + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                            + currencyVN.format(request.getTotalPrice()) +
                            "</div>" + "<br>" +
                            "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Phương thức thanh toán  :</div>"
                            + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                            + request.getPaymentMethod() +
                            "</div>" + "<br>" +
                            "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Trạng thái :</div>"
                            + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                            + "Chờ xác nhận" +
                            "</div>"+"<br>" +
                            "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Tên người nhận :</div>"
                            + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                            + request.getName() +
                            "</div>"+ "<br>"
                            +
                            "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Số điện thoại :</div>"
                            + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                            + request.getPhone() +
                            "</div>"+ "<br>"
                            +
                            "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Địa chỉ :</div>"
                            + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                            + request.getShippingAddress()+
                            "</div>"+ "<br>"+ "<br>"+
                            "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Cảm ơn bạn đã đặt hàng!!!</div>";

            // Gửi email
            emailrequest.setRecipient(request.getEmail());
            emailrequest.setSubject("Thông tin đơn hàng của bạn");
            emailrequest.setBody(emailBody);

            emailService.sendEmailHtml(
                    emailrequest.getRecipient(),
                    emailrequest.getSubject(),
                    emailrequest.getBody()
            );

            // Tạo đơn hàng và lưu DB
//            Orders newOrder = ordersSevice.createOrder(request);

            return ResponseEntity.ok(newOrder);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send email: " + e.getMessage());
        }
    }

    @PostMapping("/createAdmin")
    public ResponseEntity<?> createOrder(@RequestBody OrderDTO request) {
        try {
            // Gọi Service để xử lý logic nghiệp vụ
            Orders savedOrder = ordersSevice.createOrder(request);

            // Trả về đơn hàng thành công với mã 201 Created
            return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);

        } catch (RuntimeException e) {
            // Xử lý các lỗi như: Sản phẩm hết hàng, User không tồn tại, v.v.
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "status", "error",
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            // Xử lý các lỗi hệ thống không mong muốn
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "fail",
                            "message", "Đã xảy ra lỗi hệ thống: " + e.getMessage()
                    ));
        }
    }
    @GetMapping("/users/{idUsers}")
    public ResponseEntity<List<OrderDTO>> getUserOrders(@PathVariable String idUsers) {
        return ResponseEntity.ok(ordersSevice.getOrdersByIdUsers(idUsers));
    }
    @GetMapping("/orderAdmin")
    public ResponseEntity<Page<OrderDTO>> getOrders(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam Integer status,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam String source) {

        return ResponseEntity.ok(ordersSevice.getAllOrdersForAdmin(page, size, status, date, source));
    }
    @GetMapping("/orderAdmin/counts")
    public ResponseEntity<Map<Integer, Long>> getOrderCounts(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String source) {

        // Gọi hàm getCounts bạn đã viết trong Service
        Map<Integer, Long> counts = ordersSevice.getCounts(date, source);

        return ResponseEntity.ok(counts);
    }
    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<String> cancelOrder(@PathVariable String id, Integer status) {
        ordersSevice.updateStatusOrder(id,status);
        return ResponseEntity.ok("Hủy đơn hàng thành công");
    }
    @PutMapping("/updateStatus/multiple")
    public ResponseEntity<String> updateMultipleStatus(
            @RequestBody List<String> ids,
            @RequestParam Integer status) {
        System.out.println(ids);
        ordersSevice.updateMultipleStatusOrder(ids, status);
        return ResponseEntity.ok("Cập nhật hàng loạt thành công");
    }
    @PostMapping("/check-stock")
    public ResponseEntity<?> checkStock(@RequestBody List<OrderItemDTO> items) {
        for (OrderItemDTO itemReq : items) {
            Products product = productsRepository.findById(itemReq.getProductId()).orElse(null);

            // Nếu hết hàng, vẫn trả về status 200 (OK) nhưng kèm success = false
            if (product == null || product.getQuantity() < itemReq.getQuantity()) {
                return ResponseEntity.ok(Map.of(
                        "success", false,
                        "message", "Sản phẩm hiện tại đang hết hàng!"
                ));
            }
        }

        // Nếu đủ hàng
        return ResponseEntity.ok(Map.of("success", true));
    }

}
