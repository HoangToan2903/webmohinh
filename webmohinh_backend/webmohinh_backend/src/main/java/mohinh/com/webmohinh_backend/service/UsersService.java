package mohinh.com.webmohinh_backend.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.entity.Categories;
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


    public Users save(Users users) {
        users.setCreatedAt(LocalDateTime.now());
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
}
