package mohinh.com.webmohinh_backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.dto.EmailRequest;
import mohinh.com.webmohinh_backend.dto.OrderDTO;
import mohinh.com.webmohinh_backend.entity.Orders;
import mohinh.com.webmohinh_backend.entity.Products;
import mohinh.com.webmohinh_backend.entity.Voucher;
import mohinh.com.webmohinh_backend.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VnPayController {

    final PaymentService vnPayService; // Sử dụng cho createOrder
    final OrdersSevice ordersSevice;
    final PaymentService paymentService; // Sử dụng cho orderReturn
    EmailService emailService;
    ProductsService productsService;
    VoucherService voucherService;

    // Sử dụng ConcurrentHashMap để đảm bảo an toàn luồng (thread-safe)
    private final Map<String, OrderDTO> tempOrders = new ConcurrentHashMap<>();

    // --- Endpoint Khởi tạo đơn hàng VNPay ---

    @PostMapping("/submitOrder")
    public ResponseEntity<?> submitOrder(@RequestBody OrderDTO orderRequest, HttpServletRequest request, EmailRequest emailrequest) {
        try {
            // --- Tạo Mã Đơn Hàng Tạm (OrderCode) ---
            String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            Random random = new Random();
            StringBuilder randomPart = new StringBuilder();
            for (int i = 0; i < 6; i++) {
                randomPart.append(characters.charAt(random.nextInt(characters.length())));
            }
            String orderCode = "ORD-" + datePart + "-" + randomPart;

            log.info("🛒 Khởi tạo đơn hàng VNPay: {}", orderCode);

            // Lưu đơn hàng vào bộ nhớ tạm (chưa lưu DB)
            tempOrders.put(orderCode, orderRequest);

            int amount = orderRequest.getTotalPrice() != null ? orderRequest.getTotalPrice().intValue() : 0;

            String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();

            // Gọi service tạo link thanh toán
            String paymentUrl = vnPayService.createOrder(amount, "Thanh toán đơn hàng " + orderCode, baseUrl, orderCode);

            Map<String, Object> response = new HashMap<>();
            response.put("codeOrder", orderCode);
            response.put("paymentUrl", paymentUrl);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Lỗi khi khởi tạo thanh toán VNPay", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi tạo đơn hàng"));
        }
    }


    @GetMapping("/vnpay-return")
    public ResponseEntity<?> vnpayReturn(HttpServletRequest request, EmailRequest emailrequest) {
        try {
            int paymentResult = paymentService.orderReturn(request);
            String orderCode = request.getParameter("vnp_TxnRef");

            log.info("🔄 VNPay return: {}, result={}", orderCode, paymentResult);

            // 🟢 Nếu VNPay xác nhận thanh toán thành công
            if (paymentResult == 1) {

                // Sửa: Dùng .get() thay vì .remove() để kiểm tra sự tồn tại trước
                OrderDTO orderDTO = tempOrders.get(orderCode);

                if (orderDTO != null) {
                    orderDTO.setCodeOrder(orderCode);
                    orderDTO.setPaymentMethod("Thanh toán VNPay");

                    try {
                        NumberFormat currencyVN = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
//                        Orders newOrder = ordersSevice.createOrder(request);
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
                        String productInfo = orderDTO.getItems()
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
                        if (orderDTO.getVoucherId() != null) {
                            try {
                                voucher = voucherService.findById(orderDTO.getVoucherId());
                            } catch (Exception e) {
                                // Có thể log lại hoặc xử lý nếu voucher không tồn tại
                                System.out.println("Không tìm thấy voucher: " + e.getMessage());
                            }
                        }
                        String reducedValueStr = (voucher != null) ? String.valueOf(voucher.getReduced_value()) : "0";

                        // Tạo HTML email
                        String emailBody =
                                "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Mã đơn hàng :</div>"
                                        + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                                        + orderDTO.getCodeOrder() +
                                        "</div>" + "<br>" +
                                        "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Ngày mua :</div>"
                                        + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                                        + orderDTO.getCodeOrder() +
                                        "</div>" + "<br>" +
                                        "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Sản phẩm :</div>"
                                        + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                                        + productInfo +
                                        "</div>" + "<br>" +
                                        "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Phí ship :</div>"
                                        + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                                        + currencyVN.format(orderDTO.getShipMoney()) +
                                        "</div>"
                                        + "<br>" +
                                        "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Phần trăm giảm :</div>"
                                        + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                                        + reducedValueStr + "%" +
                                        "</div>"
                                        + "<br>" +
                                        "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Tổng cộng :</div>"
                                        + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                                        + currencyVN.format(orderDTO.getTotalPrice()) +
                                        "</div>" + "<br>" +
                                        "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Phương thức thanh toán  :</div>"
                                        + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                                        + orderDTO.getPaymentMethod() +
                                        "</div>" + "<br>" +
                                        "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Trạng thái :</div>"
                                        + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                                        + "Thanh toán thành công(Chờ vận chuyển)" +
                                        "</div>"+"<br>" +
                                        "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Tên người nhận :</div>"
                                        + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                                        + orderDTO.getName() +
                                        "</div>"+ "<br>"
                                        +
                                        "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Số điện thoại :</div>"
                                        + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                                        + orderDTO.getPhone() +
                                        "</div>"+ "<br>"
                                        +
                                        "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Địa chỉ :</div>"
                                        + "<div style='display:inline-block; margin-left:10px; white-space:pre'>"
                                        + orderDTO.getShippingAddress()+
                                        "</div>"+ "<br>"+ "<br>"+
                                        "<div style='font-size:15px; font-weight:bold; display:inline-block;'>Cảm ơn bạn đã đặt hàng!!!</div>";

                        // Gửi email
                        emailrequest.setRecipient(orderDTO.getEmail());
                        emailrequest.setSubject("Thông tin đơn hàng của bạn");
                        emailrequest.setBody(emailBody);

                        emailService.sendEmailHtml(
                                emailrequest.getRecipient(),
                                emailrequest.getSubject(),
                                emailrequest.getBody()
                        );

                        // 1. Lưu vào DB
                        Orders saved = ordersSevice.createOrder(orderDTO);

                        if (saved != null && saved.getId() != null) {
                            // 2. CHỈ xóa đơn hàng tạm khi lưu DB thành công
                            tempOrders.remove(orderCode);
                            log.info("💾 Lưu đơn hàng thành công: {}", saved.getCodeOrder());
                            return ResponseEntity.ok(Map.of(
                                    "status", "success",
                                    "message", "Thanh toán và lưu đơn hàng thành công",
                                    "codeOrder", saved.getCodeOrder()
                            ));
                        } else {
                            log.error("⚠️ Thanh toán thành công nhưng lỗi khi lưu DB: {}", orderCode);
                            // KHÔNG xóa đơn hàng tạm, để luồng sau có thể thử lại
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body(Map.of(
                                            "status", "error",
                                            "message", "Thanh toán thành công nhưng lỗi khi lưu đơn hàng"
                                    ));
                        }

                    } catch (Exception e) {
                        log.error("❌ Lỗi khi lưu đơn hàng sau thanh toán", e);
                        // KHÔNG xóa đơn hàng tạm
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Map.of(
                                        "status", "error",
                                        "message", "Thanh toán thành công nhưng lưu đơn hàng thất bại"
                                ));
                    }

                } else {
                    // Sửa: Nếu không tìm thấy trong temp, kiểm tra trong DB để xử lý trường hợp gọi lại (retry)
                    try {
                        ordersSevice.getOrderByCode(orderCode);

                        // Nếu tìm thấy, coi như thành công và đây là yêu cầu gọi lại (retry)
                        log.warn("🔄 Đơn hàng đã được lưu thành công trước đó (gọi lại): {}", orderCode);
                        return ResponseEntity.ok(Map.of(
                                "status", "success",
                                "message", "Đơn hàng đã được xử lý thành công trước đó",
                                "codeOrder", orderCode
                        ));

                    } catch (RuntimeException notFoundEx) {
                        // Nếu không có cả trong temp và DB, thì mới báo lỗi
                        log.error("❌ Không tìm thấy đơn hàng tạm và không có trong DB: {}", orderCode);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(Map.of(
                                        "status", "error",
                                        "message", "Không tìm thấy đơn hàng để lưu. Có thể đã bị xóa hoặc chưa khởi tạo."
                                ));
                    }
                }

            } else {
                // 🔴 VNPay báo thất bại
                log.warn("❌ Thanh toán thất bại: {}", orderCode);
                tempOrders.remove(orderCode); // Xóa khỏi bộ nhớ tạm
                return ResponseEntity.ok(Map.of(
                        "status", "fail",
                        "message", "Thanh toán thất bại hoặc bị hủy"
                ));
            }

        } catch (Exception e) {
            log.error("⚠️ Lỗi xử lý VNPay return", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Lỗi xử lý thanh toán: " + e.getMessage()
                    ));
        }
    }

    // --- Endpoint Lấy đơn hàng ---

    @GetMapping("/orders/{codeOrder}")
    public ResponseEntity<?> getOrderByCode(@PathVariable String codeOrder) {
        try {
            OrderDTO orderDTO = ordersSevice.getOrderByCode(codeOrder);
            return ResponseEntity.ok(orderDTO);
        } catch (RuntimeException e) {
            // Giả định ordersSevice ném RuntimeException nếu không tìm thấy
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("❌ Lỗi hệ thống khi tìm đơn hàng: {}", codeOrder, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi hệ thống: " + e.getMessage()));
        }
    }
}