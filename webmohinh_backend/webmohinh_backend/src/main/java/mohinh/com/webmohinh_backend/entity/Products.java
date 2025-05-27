package mohinh.com.webmohinh_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Products {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String name;
    String product_code;
    String character_name;
    BigDecimal price;
    BigDecimal price_promotion;
    Integer quantity;
    String description;
    Double width;
    Double height;
    Double weight;
    String type;
    String status;
    String material;
    String tag;

    @Lob
    @Basic(fetch = FetchType.LAZY)  // ảnh chỉ load khi cần thiết
    private byte[] image;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    @ManyToOne
    @JoinColumn(name = "categories_id")
    private Categories categories;

    @ManyToOne
    @JoinColumn(name = "producer_id")
    private Producer producer;


    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();
}
