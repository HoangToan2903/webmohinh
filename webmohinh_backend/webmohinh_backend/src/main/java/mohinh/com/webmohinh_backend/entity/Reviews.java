package mohinh.com.webmohinh_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Reviews {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    Integer rating;
    String comment;
    LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Products products;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users users;
}
