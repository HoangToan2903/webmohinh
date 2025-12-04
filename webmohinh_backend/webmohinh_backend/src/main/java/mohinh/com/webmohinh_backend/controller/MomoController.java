package mohinh.com.webmohinh_backend.controller;



import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.dto.OrderDTO;
import mohinh.com.webmohinh_backend.service.MomoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MomoController {

    MomoService momoService;

    // Lưu đơn hàng tạm thời
    Map<String, OrderDTO> tempOrders = new ConcurrentHashMap<>();

    @PostMapping("/momosubmitOrder")
    public ResponseEntity<?> submitOrder(@RequestBody OrderDTO orderRequest, HttpServletRequest request) {
        try {
            // 1. Tạo mã đơn hàng: ORD-yyyyMMdd-XXXXXX
            String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            Random random = new Random();
            StringBuilder randomPart = new StringBuilder();
            for (int i = 0; i < 6; i++) {
                randomPart.append(characters.charAt(random.nextInt(characters.length())));
            }
            String orderCode = "ORD-" + datePart + "-" + randomPart;

            log.info("🛒 Khởi tạo đơn hàng Momo: {}", orderCode);

            // 2. Lưu đơn hàng tạm thời
            tempOrders.put(orderCode, orderRequest);

            // 3. Lấy số tiền
            long amount = orderRequest.getTotalPrice() != null ? orderRequest.getTotalPrice().longValue() : 0;

            // 4. Gọi MomoService để tạo link thanh toán
            String paymentUrl = momoService.createPayment(orderCode, amount);

            // 5. Trả kết quả về client
            Map<String, Object> response = new HashMap<>();
            response.put("codeOrder", orderCode);
            response.put("paymentUrl", paymentUrl);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Lỗi khi khởi tạo thanh toán Momo", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi tạo đơn hàng Momo"));
        }
    }
}
