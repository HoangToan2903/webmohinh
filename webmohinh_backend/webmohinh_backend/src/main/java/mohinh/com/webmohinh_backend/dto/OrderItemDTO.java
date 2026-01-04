package mohinh.com.webmohinh_backend.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import mohinh.com.webmohinh_backend.entity.Products;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemDTO {
     String productId;
     String productName;
     Integer quantity;
     BigDecimal price;
}
