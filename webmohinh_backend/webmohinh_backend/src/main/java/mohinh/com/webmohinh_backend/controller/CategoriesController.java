package mohinh.com.webmohinh_backend.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.service.CategoriesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoriesController {

    CategoriesService categoriesService;


    @PostMapping("/Categories")
    @CrossOrigin
    public ResponseEntity<CategoriesController> createCategory(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image
    ) {
        try {
            CategoriesController category = new CategoriesController();
            category.setName(name);
            category.setDescription(description);

            CategoriesController saved = categoriesService.saveCategory(category, image);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
