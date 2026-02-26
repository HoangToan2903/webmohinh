package mohinh.com.webmohinh_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl; // Lưu link từ Cloudinary

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore // Ngăn không cho Image gọi ngược lại Product khi tạo JSON
    private Products product;
}
