package mohinh.com.webmohinh_backend.repository;

import mohinh.com.webmohinh_backend.entity.Categories;
import mohinh.com.webmohinh_backend.entity.Producer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriesRepository extends JpaRepository<Categories, String> {
    boolean existsByName(String name);
    // Tìm kiếm theo tên có phân trang (trả về Page)
    Page<Categories> findByNameStartingWithIgnoreCase(String namePrefix, Pageable pageable);

}
