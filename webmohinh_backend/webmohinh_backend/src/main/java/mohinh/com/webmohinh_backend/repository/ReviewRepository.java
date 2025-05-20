package mohinh.com.webmohinh_backend.repository;


import mohinh.com.webmohinh_backend.entity.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Reviews, String> {
}
