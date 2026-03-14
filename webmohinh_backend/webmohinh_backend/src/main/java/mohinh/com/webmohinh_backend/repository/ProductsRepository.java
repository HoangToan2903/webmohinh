package mohinh.com.webmohinh_backend.repository;


import mohinh.com.webmohinh_backend.entity.Producer;
import mohinh.com.webmohinh_backend.entity.Products;
import mohinh.com.webmohinh_backend.entity.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductsRepository extends JpaRepository<Products, String> {
    boolean existsByName(String name);
    List<Products> findBySale(Sale sale);

    // Tìm kiếm theo tên có phân trang (trả về Page)
    Page<Products> findByNameStartingWithIgnoreCase(String namePrefix, Pageable pageable);


    // ProductsRepository.java
    @Query("SELECT p FROM Products p " +
            "WHERE p.categories.id = :categoryId " +
            "AND (:producerId IS NULL OR p.producer.id = :producerId) " +
            "AND p.price BETWEEN :minPrice AND :maxPrice")
    Page<Products> findProductsWithFilters(
            @Param("categoryId") String categoryId,
            @Param("producerId") String producerId,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            Pageable pageable
    );
}
