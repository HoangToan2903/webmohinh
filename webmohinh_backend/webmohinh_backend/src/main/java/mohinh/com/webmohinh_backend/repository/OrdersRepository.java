package mohinh.com.webmohinh_backend.repository;

import mohinh.com.webmohinh_backend.dto.DashboardDTO;
import mohinh.com.webmohinh_backend.dto.TopProductDTO;
import mohinh.com.webmohinh_backend.entity.OrderSource;
import mohinh.com.webmohinh_backend.entity.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; // ĐẢM BẢO DÒNG NÀY ĐÚNG
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, String> {

    // Tìm đơn hàng theo mã
    Optional<Orders> findByCodeOrder(String codeOrder);

    // Tìm đơn hàng theo User ID
    List<Orders> findByUserIdOrderByCreatedAtDesc(String userId);

    // Truy vấn lọc cho Admin (PHÂN TRANG)
    @Query("SELECT o FROM Orders o WHERE o.status = :status " +
            "AND o.createdAt BETWEEN :start AND :end " +
            "AND (:source IS NULL OR o.source = :source)")
    Page<Orders> findByAdminFilters(
            @Param("status") Integer status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("source") OrderSource source, // Lưu ý ép kiểu Enum nếu cần
            Pageable pageable);

    // Truy vấn đếm số lượng cho Badge (TỔNG)
    @Query("SELECT o.status, COUNT(o) FROM Orders o " +
            "WHERE o.createdAt BETWEEN :start AND :end " +
            "AND (:source IS NULL OR o.source = :source) " +
            "GROUP BY o.status")
    List<Object[]> countByStatusAndDate(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("source") OrderSource source);

    // tiếp
    // Thống kê tổng hợp
    // 1. Lấy 4 chỉ số tổng quát ở các thẻ card
    @Query("SELECT " +
            "COALESCE(SUM(CASE WHEN o.status = 2 THEN o.total_price ELSE 0 END), 0) as totalRevenue, " +
            "COALESCE(SUM(CASE WHEN o.status IN (0, 1, 2) THEN o.total_price ELSE 0 END), 0) as totalEstimatedRevenue, " +
            "COUNT(CASE WHEN o.status IN (0, 1, 2, 3) THEN o.id ELSE NULL END) as totalOrders, " +
            // Lưu ý: Tên alias (as ...) phải viết đúng chữ thường/hoa khớp với React
            "COALESCE(SUM(CASE WHEN o.status = 0 THEN 1 ELSE 0 END), 0) as pendingOrders, " +
            "COALESCE(SUM(CASE WHEN o.status = 1 THEN 1 ELSE 0 END), 0) as shippingOrders, " +
            "COALESCE(SUM(CASE WHEN o.status = 2 THEN 1 ELSE 0 END), 0) as completedOrders, " +
            "COALESCE(SUM(CASE WHEN o.status = 3 THEN 1 ELSE 0 END), 0) as cancleOrders, " +
            "(SELECT COUNT(u.id) FROM Users u) as totalUsers " +
            "FROM Orders o")
    Map<String, Object> getRawDashboardStats();

    // 2. Thống kê Doanh thu & Chi phí theo tháng (cho biểu đồ Area và Bar)
    // Chi phí được tính bằng tổng (giá bán sản phẩm * số lượng * 0.7) - giả định giá vốn 70%
    @Query("SELECT MONTH(o.createdAt) as month, " +
            "SUM(o.total_price) as doanhthu, " +
            "SUM(o.total_price) * 0.7 as expenses " +
            "FROM Orders o WHERE YEAR(o.createdAt) = YEAR(CURRENT_DATE) AND  o.status = 2  " +
            "GROUP BY MONTH(o.createdAt) ORDER BY MONTH(o.createdAt) ASC")
    List<Map<String, Object>> getRevenueAndExpensesByMonth();

    @Query("SELECT p.name as name, " +
            "SUM(oi.quantity) as soldQuantity, " +
            "SUM(oi.price * oi.quantity) as revenue, " +
            "(SELECT pi.imageUrl FROM ProductImage pi WHERE pi.product.id = p.id ORDER BY pi.id ASC LIMIT 1) as imageUrl " +
            "FROM Order_items oi JOIN oi.products p JOIN oi.orders o " +
            "WHERE o.status  IN (0, 1, 2) " +
            "GROUP BY p.id, p.name " +
            "ORDER BY soldQuantity DESC")
    List<Map<String, Object>> getTopSellingProductsRaw(Pageable pageable);



    @Query("SELECT " +
            "COALESCE(SUM(CASE WHEN o.status = 2 THEN o.total_price ELSE 0 END), 0) as totalRevenue, " +
            "COALESCE(SUM(CASE WHEN o.status IN (0, 1, 2) THEN o.total_price ELSE 0 END), 0) as totalEstimatedRevenue, " +
            "COUNT(CASE WHEN o.status IN (0, 1, 2, 3) THEN o.id END) as totalOrders, " +
            "SUM(CASE WHEN o.status = 0 THEN 1 ELSE 0 END) as pendingOrders, " +
            "SUM(CASE WHEN o.status = 1 THEN 1 ELSE 0 END) as shippingOrders, " +
            "SUM(CASE WHEN o.status = 2 THEN 1 ELSE 0 END) as completedOrders, " +
            "SUM(CASE WHEN o.status = 3 THEN 1 ELSE 0 END) as cancelOrders, " + // Sửa 'cancle' thành 'cancel'
            "(SELECT COUNT(u.id) FROM Users u WHERE FUNCTION('DATE', u.createdAt) = :date AND u.role = 'USER') as totalUsers " + // Lưu ý: 'User' thường là tên Entity (viết hoa, số ít)
            "FROM Orders o " + // Thêm dấu cách sau 'o'
            "WHERE FUNCTION('DATE', o.createdAt) = :date") // So sánh ngày chính xác hơn
    Map<String, Object> getRawDashboardStatsByDate(@Param("date") LocalDate date);


    @Query("SELECT p.name as name, " +
            "SUM(oi.quantity) as soldQuantity, " +
            "SUM(oi.price * oi.quantity) as revenue, " +
            "(SELECT pi.imageUrl FROM ProductImage pi WHERE pi.product.id = p.id ORDER BY pi.id ASC LIMIT 1) as imageUrl " +
            "FROM Order_items oi JOIN oi.products p JOIN oi.orders o " +
            "WHERE o.status  IN (0, 1, 2) " +
            "AND FUNCTION('DATE', o.createdAt) = :date " +
            "GROUP BY p.id, p.name " +
            "ORDER BY soldQuantity DESC")
    List<Map<String, Object>> getTopSellingProductsRawDate(@Param("date") LocalDate date, Pageable pageable);
}