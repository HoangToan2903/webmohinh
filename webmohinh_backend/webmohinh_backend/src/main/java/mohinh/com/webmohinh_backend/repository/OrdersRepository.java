package mohinh.com.webmohinh_backend.repository;

import mohinh.com.webmohinh_backend.entity.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; // ĐẢM BẢO DÒNG NÀY ĐÚNG
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
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
            @Param("source") mohinh.com.webmohinh_backend.entity.OrderSource source, // Lưu ý ép kiểu Enum nếu cần
            Pageable pageable);

    // Truy vấn đếm số lượng cho Badge (TỔNG)
    @Query("SELECT o.status, COUNT(o) FROM Orders o " +
            "WHERE o.createdAt BETWEEN :start AND :end " +
            "AND (:source IS NULL OR o.source = :source) " +
            "GROUP BY o.status")
    List<Object[]> countByStatusAndDate(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("source") mohinh.com.webmohinh_backend.entity.OrderSource source);
}