package mohinh.com.webmohinh_backend.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.entity.Categories;
import mohinh.com.webmohinh_backend.service.CategoriesService;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class CategoriesController {

    CategoriesService categoryService; // Inject Interface

    @GetMapping("/categoryAll")
    public Page<Categories> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        return categoryService.getAll(page, size);
    }
    @PostMapping("/category")
    public ResponseEntity<Categories> create(@RequestBody Categories category) {
        // category lúc này đã chứa name, description và image (URL string)
        Categories savedCategory = categoryService.create(category);
        return ResponseEntity.ok(savedCategory);
    }

    @PutMapping("/category/{id}")
    public Categories update(@PathVariable String id, @RequestBody Categories category) {
        return categoryService.update(id, category);
    }
    @GetMapping("/category/search")
    public Page<Categories> search(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        return categoryService.searchByName(name, page, size);
    }
//    @PutMapping("/category/{id}")
//    public Categories update(@PathVariable String id,
//                           @RequestParam("name") String name,
//                           @RequestParam("description") String description,
//                           @RequestParam(value = "image", required = false) MultipartFile file) {
//        return categoryService.update(id, name, description, file);
//    }

    @DeleteMapping("/category/{id}")
    public void delete(@PathVariable String id) {
        categoryService.delete(id);
    }

}

