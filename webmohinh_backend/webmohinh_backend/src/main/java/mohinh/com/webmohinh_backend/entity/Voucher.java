package mohinh.com.webmohinh_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String codeVoucher;
    String description;
    Double reduced_value;//giá trị giảm
    Double conditions_apply;//điều kiện giảm
    Integer quantity;
    String status;
    LocalDateTime created_at;
    LocalDateTime start_date;
    LocalDateTime end_date;
    LocalDateTime update_at;
}
