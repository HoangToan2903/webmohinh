package mohinh.com.webmohinh_backend.repository;

import mohinh.com.webmohinh_backend.entity.Role;
import mohinh.com.webmohinh_backend.entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, String> {
    Optional<Users> findByUsername(String username);
    Page<Users> findByRole(Role role, Pageable pageable);
    Integer countByRole(Role role);}

