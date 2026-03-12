package mohinh.com.webmohinh_backend.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginRequest {
    String idUser;
    String username;
    String email;
    String password;
    Integer status;
    String role;
}

