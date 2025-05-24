package mohinh.com.webmohinh_backend.repository;

import mohinh.com.webmohinh_backend.entity.Producer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProducerRepository extends JpaRepository<Producer, String> {
    boolean existsByName(String name);
    // Tìm kiếm theo tên có phân trang (trả về Page)
    Page<Producer> findByNameStartingWithIgnoreCase(String namePrefix, Pageable pageable);
}
