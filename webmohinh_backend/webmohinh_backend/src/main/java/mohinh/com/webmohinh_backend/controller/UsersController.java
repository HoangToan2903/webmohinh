package mohinh.com.webmohinh_backend.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.dto.LoginRequest;
import mohinh.com.webmohinh_backend.entity.Sale;
import mohinh.com.webmohinh_backend.entity.Users;
import mohinh.com.webmohinh_backend.service.UsersService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class UsersController {

    UsersService usersService;

    @PostMapping("/users")
    public Users save(@RequestBody Users users) {
        return usersService.save(users);
    }

    @PostMapping("/login")
    public ResponseEntity<?> handleLogin(@RequestBody Users request) { // Sử dụng Entity Users hoặc DTO phù hợp
        try {
            // Gọi service để xác thực
            LoginRequest user = usersService.login(request.getUsername(), request.getPassword());

            // Trả về thông tin cần thiết cho Frontend
            Map<String, Object> response = new HashMap<>();
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", user.getRole()); // Trả về "ADMIN" hoặc "STAFF"

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Trả về lỗi 401 nếu sai mật khẩu/tên đăng nhập
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
