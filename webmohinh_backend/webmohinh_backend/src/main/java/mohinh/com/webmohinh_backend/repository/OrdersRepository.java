package mohinh.com.webmohinh_backend.repository;

import mohinh.com.webmohinh_backend.entity.Cart_items;
import mohinh.com.webmohinh_backend.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrdersRepository extends JpaRepository<Orders, String> {
    Optional<Orders> findByCodeOrder(String codeOrder);
}
