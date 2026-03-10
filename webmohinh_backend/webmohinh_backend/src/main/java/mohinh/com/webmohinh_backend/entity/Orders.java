package mohinh.com.webmohinh_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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
    Integer status;
    LocalDateTime createdAt;
    String shipping_address;
    String email;
    String phone;
    String notes;
    String name;
    String codeOrder;
    String payment_method;
    BigDecimal ship_money;


    @ManyToOne
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;
    // Quan hệ với Order_items
    @OneToMany(mappedBy = "orders", cascade = CascadeType.ALL)
    private List<Order_items> orderItems;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", length = 50) // Đảm bảo độ dài cột đủ chứa chuỗi
    private OrderSource source;
}
