package mohinh.com.webmohinh_backend.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.dto.LoginRequest;
import mohinh.com.webmohinh_backend.entity.Categories;
import mohinh.com.webmohinh_backend.entity.Role;
import mohinh.com.webmohinh_backend.entity.Users;
import mohinh.com.webmohinh_backend.repository.CategoriesRepository;
import mohinh.com.webmohinh_backend.repository.UsersRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UsersService {
    UsersRepository usersRepository;
    PasswordEncoder passwordEncoder;

    public Users save(Users users) {
        // Tự động set Role là USER nếu chưa có Role nào được chỉ định
        if (users.getRole() == null) {
            users.setRole(Role.USER);
        }

        users.setCreatedAt(LocalDateTime.now());

        // Mã hóa mật khẩu
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        users.setPassword(passwordEncoder.encode(users.getPassword()));

        return usersRepository.save(users);
    }

    public List<Users> getAll(){
        return usersRepository.findAll();
    }

    public Users update(String id, Users users) {
        Users usersUpdate = findById(id);
        usersUpdate.setUsername(users.getUsername());
        usersUpdate.setPassword(users.getPassword());
        usersUpdate.setEmail(users.getEmail());
        usersUpdate.setCreatedAt(users.getCreatedAt());
        return usersRepository.save(usersUpdate);
    }


    public void delete(String id){
        usersRepository.deleteById(id);
    }


    public Users findById(String id) {
        return usersRepository.findById(id).orElseThrow(() -> new RuntimeException(" not found"));
    }

    public LoginRequest login(String username, String rawPassword) {
        // 1. Tìm user theo username
        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // 2. Kiểm tra mật khẩu (Sử dụng matches của Spring Security)
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Mật khẩu không chính xác");
        }

        // 3. Kiểm tra Role có phải là USER hay không
        if (!Role.USER.equals(user.getRole())) {
            throw new RuntimeException("Bạn không có quyền truy cập (Chỉ dành cho USER)");
        }

        // 4. Trả về Object chứa thông tin user (để React lấy email)
        return new LoginRequest(
                user.getUsername(),
                user.getEmail(),
                "Đăng nhập thành công!"
        );
    }
}
