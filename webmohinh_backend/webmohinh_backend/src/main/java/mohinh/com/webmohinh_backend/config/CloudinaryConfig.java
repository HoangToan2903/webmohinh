package mohinh.com.webmohinh_backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration

public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "djw87hphx");
        config.put("api_key", "353929444176728");
        config.put("api_secret", "9K571YaN5XfIwirNvxDUHEdVqnk");
        return new Cloudinary(config);
    }
}