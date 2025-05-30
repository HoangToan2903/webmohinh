package mohinh.com.webmohinh_backend.repository;


import mohinh.com.webmohinh_backend.entity.Producer;
import mohinh.com.webmohinh_backend.entity.Products;
import mohinh.com.webmohinh_backend.entity.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductsRepository extends JpaRepository<Products, String> {
    boolean existsByName(String name);
    List<Products> findBySale(Sale sale);

    // Tìm kiếm theo tên có phân trang (trả về Page)
    Page<Products> findByNameStartingWithIgnoreCase(String namePrefix, Pageable pageable);
}
