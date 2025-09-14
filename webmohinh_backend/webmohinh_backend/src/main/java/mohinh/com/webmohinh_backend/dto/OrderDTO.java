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
     String name;
     String email;
     String shippingAddress;
     Integer phone;
     String notes;
     String paymentMethod;
     BigDecimal shipMoney;
     BigDecimal totalPrice;
     String codeOrder;
     String voucherId;
     List<OrderItemDTO> items;

}
