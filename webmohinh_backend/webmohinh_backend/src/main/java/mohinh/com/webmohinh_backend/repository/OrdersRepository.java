package mohinh.com.webmohinh_backend.repository;

import mohinh.com.webmohinh_backend.entity.Cart_items;
import mohinh.com.webmohinh_backend.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdersRepository extends JpaRepository<Orders, String> {
}
