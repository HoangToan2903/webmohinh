package mohinh.com.webmohinh_backend.repository;

import mohinh.com.webmohinh_backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, String> {
}
