package mohinh.com.webmohinh_backend.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class TopProductDTO {
    private String name;
    private Long soldQuantity;
    private BigDecimal revenue;
    private String imageUrl;
}
