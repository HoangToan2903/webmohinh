package mohinh.com.webmohinh_backend.config;

import mohinh.com.webmohinh_backend.entity.Role;
import mohinh.com.webmohinh_backend.entity.Users;
import mohinh.com.webmohinh_backend.repository.UsersRepository;
import org.apache.catalina.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UsersRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                Users admin = new Users();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123")); // Mã hóa mật khẩu
                admin.setRole(Role.ADMIN);
                admin.setEmail("admin@example.com");

                userRepository.save(admin);
                System.out.println(">>> Đã khởi tạo tài khoản Admin mặc định.");
            }
        };
    }
}
