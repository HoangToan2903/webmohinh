package mohinh.com.webmohinh_backend.repository;

import mohinh.com.webmohinh_backend.entity.Categories;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriesRepository extends JpaRepository<Categories, String> {
}
