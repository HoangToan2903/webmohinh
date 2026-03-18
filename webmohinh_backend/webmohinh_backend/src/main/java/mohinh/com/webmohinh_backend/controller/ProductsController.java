package mohinh.com.webmohinh_backend.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
//import mohinh.com.webmohinh_backend.dto.CategoryDTO;
import mohinh.com.webmohinh_backend.dto.ProductsDTO;
import mohinh.com.webmohinh_backend.entity.*;
import mohinh.com.webmohinh_backend.repository.ProductsRepository;
import mohinh.com.webmohinh_backend.service.ProductsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class ProductsController {

    ProductsService productsService;
    ProductsRepository productsRepository;

    @GetMapping("/productsAll")
    public Page<Products> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        return productsService.getAll(page, size);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Products> getProduct(@PathVariable String id) {
        Products product = productsService.findById(id);
        return ResponseEntity.ok(product);
    }


    @DeleteMapping("/products/{id}")
    String delete(@PathVariable String id) {
        productsService.delete(id);
        return " deleted successfully";
    }

    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody ProductsDTO dto) {
        try {
            // DTO lúc này đã có sẵn list imageUrls từ Frontend gửi lên
            Products createdProduct = productsService.createProduct(dto);
            return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }


//    @GetMapping("/products/search")
//    public Page<Products> searchProducts(
//            @RequestParam(defaultValue = "") String name,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "8") int size) {
//        Page<Products> productsPage = productsService.searchProductsByPrefix(name, page, size);
//        return productsPage;
//    }
    @GetMapping("/products/search-suggestions")
    public ResponseEntity<List<Products>> getSuggestions(@RequestParam String name) {
        List<Products> results = productsService.searchProductsByName(name);
        return ResponseEntity.ok(results);
    }
    @PutMapping("/products/{id}")
    public Products update(@PathVariable String id, @RequestBody ProductsDTO productsdto) {
        return productsService.update(id, productsdto);
    }

    @PutMapping("/addSale")
    public ResponseEntity<Products> assignSaleToProduct(
            @RequestParam String productId,
            @RequestParam(name = "idSale", required = false) String idSale) {
        Products updatedProduct = productsService.addOrUpdateSaleToProduct(productId, idSale);
        return ResponseEntity.ok(updatedProduct);
    }
    @GetMapping("/shearchCategory/{categoryId}")
    public ResponseEntity<Page<Products>> getProductsByCategory(
            @PathVariable String categoryId,
            @RequestParam(required = false) String producerId,
            @RequestParam(defaultValue = "0") Double minPrice,
            @RequestParam(defaultValue = "100000000") Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        // Tạo đối tượng phân trang
        Pageable pageable = PageRequest.of(page, size);

        // Gọi service xử lý lọc
        Page<Products> productPage = productsService.getProductsByCategoryFiltered(
                categoryId,
                producerId,
                minPrice,
                maxPrice,
                pageable
        );

        return ResponseEntity.ok(productPage);
    }
    @GetMapping("/productsSale")
    public ResponseEntity<List<Products>> getProductsOnSale() {
        List<Products> products = productsService.getProductsOnSale();

        if (products.isEmpty()) {
            return ResponseEntity.noContent().build(); // Trả về 204 nếu không có sản phẩm nào
        }

        return ResponseEntity.ok(products); // Trả về 200 và danh sách sản phẩm
    }

    @GetMapping("/products/search")
    public ResponseEntity<Page<Products>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        // Tạo đối tượng phân trang (có thể thêm Sort nếu muốn)
        Pageable pageable = PageRequest.of(page, size);

        Page<Products> result = productsService.searchProducts(name, categoryId, pageable);
        return ResponseEntity.ok(result);
    }
}
