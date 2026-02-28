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
    public ResponseEntity<?> handleLogin(@RequestBody LoginRequest request) {
        try {
            LoginRequest response = usersService.login(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(response); // Trả về JSON chứa id, username, email...
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
