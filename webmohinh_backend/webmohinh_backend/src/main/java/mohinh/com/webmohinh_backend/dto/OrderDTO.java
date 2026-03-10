package mohinh.com.webmohinh_backend.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import mohinh.com.webmohinh_backend.entity.Voucher;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDTO {
     String id;
     String name;
     String email;
     String shippingAddress;
     String phone;
     String notes;
     String paymentMethod;
     BigDecimal shipMoney;
     LocalDateTime createdAt;
     BigDecimal totalPrice;
     String codeOrder;
     String voucherId;
     String userId;
     Integer status;
     Double voucherDiscount;
     String userName;
     List<OrderItemDTO> items;
     String source;
}
