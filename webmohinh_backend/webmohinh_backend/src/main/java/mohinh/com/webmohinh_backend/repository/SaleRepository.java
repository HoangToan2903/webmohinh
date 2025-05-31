package mohinh.com.webmohinh_backend.repository;

import mohinh.com.webmohinh_backend.entity.Sale;
import mohinh.com.webmohinh_backend.entity.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository  extends JpaRepository<Sale, String> {
    boolean existsByName(String name);
    // Tìm kiếm theo tên có phân trang (trả về Page)
    Page<Sale> findByNameStartingWithIgnoreCase(String namePrefix, Pageable pageable);
}
