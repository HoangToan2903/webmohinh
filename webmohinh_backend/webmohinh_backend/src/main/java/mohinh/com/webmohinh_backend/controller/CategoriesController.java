package mohinh.com.webmohinh_backend.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.dto.CategoryDTO;
import mohinh.com.webmohinh_backend.entity.Categories;
import mohinh.com.webmohinh_backend.entity.Producer;
import mohinh.com.webmohinh_backend.service.CategoriesService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@RestController
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoriesController {

    CategoriesService categoriesService;

    private CategoryDTO toDTO(Categories category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        if (category.getImage() != null) {
            dto.setImageBase64(Base64.getEncoder().encodeToString(category.getImage()));
        }
        return dto;
    }

    @GetMapping("/categoriesAll")
    @CrossOrigin
    public ResponseEntity<Page<CategoryDTO>> getAllCategories(Pageable pageable) {
        Page<Categories> categoriesPage = categoriesService.getAll(pageable);

        Page<CategoryDTO> dtoPage = categoriesPage.map(this::toDTO);

        return ResponseEntity.ok(dtoPage);
    }

    @PostMapping("/categories")
    @CrossOrigin
    public ResponseEntity<?> createCategory(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {

        Categories category = new Categories();
        category.setName(name);
        category.setDescription(description);

        if (imageFile != null && !imageFile.isEmpty()) {
            category.setImage(imageFile.getBytes());
        }

        Categories saved = categoriesService.save(category);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/categories/{id}")
    @CrossOrigin
    String delete(@PathVariable String id) {
        categoriesService.delete(id);
        return " deleted successfully";
    }

    //    @PutMapping("/categories/{id}")
//    @CrossOrigin
//    public ResponseEntity<Categories> updateCategoryWithImage(
//            @PathVariable String id,
//            @RequestParam("name") String name,
//            @RequestParam("description") String description,
//            @RequestParam(value = "imageBase64", required = false) MultipartFile imageFile
//    ) throws IOException {
//        Categories existing = categoriesService.findById(id);
//        existing.setName(name);
//        existing.setDescription(description);
//        if (imageFile != null && !imageFile.isEmpty()) {
//            existing.setImage(imageFile.getBytes());
//        }
//        Categories updated = categoriesService.save(existing);
//        return ResponseEntity.ok(updated);
//    }
    @PutMapping(value = "/categories/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @CrossOrigin
    public Categories update(@PathVariable String id,
                             @RequestParam("name") String name,
                             @RequestParam("description") String description,
                             @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IOException {

        // Lấy bản ghi hiện tại từ DB
        Categories existingCategory = categoriesService.findById(id);

        // Cập nhật các trường name, description
        existingCategory.setName(name);
        existingCategory.setDescription(description);

        // Chỉ cập nhật image nếu có file mới
        if (imageFile != null && !imageFile.isEmpty()) {
            existingCategory.setImage(imageFile.getBytes());
        }

        return categoriesService.update(id, existingCategory);
    }




    @GetMapping("categories/search")
    @CrossOrigin
    public Page<CategoryDTO> searchCategories(
            @RequestParam(defaultValue = "") String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {

        Page<Categories> categoriesPage = categoriesService.searchCategoriesByPrefix(name, page, size);
        return categoriesPage.map(CategoryDTO::new);
    }

}

