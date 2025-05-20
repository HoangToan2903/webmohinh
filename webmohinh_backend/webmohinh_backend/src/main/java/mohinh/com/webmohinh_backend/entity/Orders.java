package mohinh.com.webmohinh_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import mohinh.com.webmohinh_backend.config.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    BigDecimal total_price;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    LocalDateTime createdAt;
    String shipping_address;
}
