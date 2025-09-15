package mohinh.com.webmohinh_backend.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.dto.OrderDTO;
import mohinh.com.webmohinh_backend.entity.Orders;
import mohinh.com.webmohinh_backend.service.OrdersSevice;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class OrdersController {

    OrdersSevice ordersSevice;


    @PostMapping("/orders")
    public ResponseEntity<Orders> createOrder(@RequestBody OrderDTO request) {
        Orders newOrder = ordersSevice.createOrder(request);
        return ResponseEntity.ok(newOrder);
    }

}
