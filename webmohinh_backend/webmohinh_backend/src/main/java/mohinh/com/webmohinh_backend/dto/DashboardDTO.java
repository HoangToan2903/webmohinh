package mohinh.com.webmohinh_backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter @Setter @Builder
public class DashboardDTO {
    private BigDecimal totalRevenue;
    private BigDecimal totalEstimatedRevenue;
    private Long totalUsers;
    private Long totalOrders;
    private Long pendingOrders;   // Status 0
    private Long shippingOrders;  // Status 1
    private Long completedOrders; // Status 2
    private Long cancleOrders; // Status 3
    private Double conversionRate;
    private List<Map<String, Object>> revenueByMonth; // [{month: "Tháng 1", amount: 4000}, ...]
    private List<TopProductDTO> topProducts;
}