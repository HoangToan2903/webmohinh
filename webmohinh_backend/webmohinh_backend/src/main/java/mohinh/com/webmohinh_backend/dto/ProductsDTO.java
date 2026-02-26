package mohinh.com.webmohinh_backend.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import mohinh.com.webmohinh_backend.entity.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductsDTO {
    String name;
    String product_code;
    String character_name;
    BigDecimal price;
    Integer quantity;
    String description;
    Double width;
    Double height;
    Double weight;
    String type;
    String status;
    String material;
    Set<String> tags;
    String categories_id;
    String producer_id;
    String sale_id;
    List<String> imageUrls;
}
