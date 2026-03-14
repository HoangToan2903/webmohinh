package mohinh.com.webmohinh_backend.service;

import lombok.RequiredArgsConstructor;
import mohinh.com.webmohinh_backend.dto.*;
import mohinh.com.webmohinh_backend.entity.Role;
import mohinh.com.webmohinh_backend.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final OrdersRepository orderRepository;

    public DashboardDTO getDashboardData() {
        Map<String, Object> stats = orderRepository.getRawDashboardStats();
        List<Map<String, Object>> chartData = orderRepository.getRevenueAndExpensesByMonth();

        // Xử lý Top sản phẩm có ảnh
        List<TopProductDTO> topProducts = orderRepository.getTopSellingProductsRaw(PageRequest.of(0, 5))
                .stream()
                .map(row -> new TopProductDTO(
                        (String) row.get("name"),
                        ((Number) row.get("soldQuantity")).longValue(),
                        (BigDecimal) row.get("revenue"),
                        (String) row.get("imageUrl") // Lấy URL ảnh từ query
                ))
                .collect(Collectors.toList());

        return DashboardDTO.builder()
                .totalRevenue((BigDecimal) stats.get("totalRevenue"))
                .totalOrders((Long) stats.get("totalOrders"))
                .totalRevenue((BigDecimal) stats.get("totalRevenue"))
                .totalEstimatedRevenue((BigDecimal) stats.get("totalEstimatedRevenue"))
                .totalUsers((Long) stats.get("totalUsers"))
                .pendingOrders((Long) stats.get("pendingOrders"))
                .shippingOrders((Long) stats.get("shippingOrders"))
                .completedOrders((Long) stats.get("completedOrders"))
                .cancleOrders((Long) stats.get("cancleOrders"))
                .revenueByMonth(chartData)
                .topProducts(topProducts)
                .build();
    }

    public DashboardDTO getStats(LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }

        List<TopProductDTO> topProducts = orderRepository.getTopSellingProductsRawDate(date, PageRequest.of(0, 5))
                .stream()
                .map(row -> new TopProductDTO(
                        (String) row.get("name"),
                        ((Number) row.get("soldQuantity")).longValue(),
                        (BigDecimal) row.get("revenue"),
                        (String) row.get("imageUrl") // Lấy URL ảnh từ query
                ))
                .collect(Collectors.toList());
        Map<String, Object> stats = orderRepository.getRawDashboardStatsByDate(date);
        return DashboardDTO.builder()
                .totalRevenue((BigDecimal) stats.get("totalRevenue"))
                .totalOrders((Long) stats.get("totalOrders"))
                .totalEstimatedRevenue((BigDecimal) stats.get("totalEstimatedRevenue"))
                .totalRevenue((BigDecimal) stats.get("totalRevenue"))
                .totalUsers((Long) stats.get("totalUsers"))
                .pendingOrders((Long) stats.get("pendingOrders"))
                .shippingOrders((Long) stats.get("shippingOrders"))
                .completedOrders((Long) stats.get("completedOrders"))
                .cancleOrders((Long) stats.get("cancleOrders"))
                .topProducts(topProducts)
                .build();
    }


}