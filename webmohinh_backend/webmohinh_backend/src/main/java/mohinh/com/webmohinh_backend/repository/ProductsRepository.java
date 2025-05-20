package mohinh.com.webmohinh_backend.repository;


import mohinh.com.webmohinh_backend.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductsRepository extends JpaRepository<Products, String> {
}
