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
    Page<Products> findByNameContainingIgnoreCase(String namePrefix, Pageable pageable);


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
    List<Products> findBySaleIsNotNullAndSaleStatusAndStatus(Integer saleStatus, String productStatus);

    @Query("SELECT p FROM Products p WHERE LOWER(p.name) LIKE LOWER(concat('%', :name, '%'))")
    List<Products> searchByName(@Param("name") String name, Pageable pageable);


    @Query("SELECT p FROM Products p WHERE " +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:categoryId IS NULL OR p.categories.id = :categoryId)")
    Page<Products> searchProducts(
            @Param("name") String name,
            @Param("categoryId") String categoryId,
            Pageable pageable
    );
}
