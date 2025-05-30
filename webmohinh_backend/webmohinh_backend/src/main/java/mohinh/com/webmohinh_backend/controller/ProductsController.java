package mohinh.com.webmohinh_backend.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.dto.CategoryDTO;
import mohinh.com.webmohinh_backend.dto.ProductsDTO;
import mohinh.com.webmohinh_backend.entity.Categories;
import mohinh.com.webmohinh_backend.entity.Producer;
import mohinh.com.webmohinh_backend.entity.ProductImage;
import mohinh.com.webmohinh_backend.entity.Products;
import mohinh.com.webmohinh_backend.repository.ProductsRepository;
import mohinh.com.webmohinh_backend.service.ProducerService;
import mohinh.com.webmohinh_backend.service.ProductsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductsController {

    ProductsService productsService;
    ProductsRepository productsRepository;

    private ProductsDTO toDTO(Products products) {
        ProductsDTO dto = new ProductsDTO();
        dto.setId(products.getId());
        dto.setName(products.getName());
        dto.setDescription(products.getDescription());
        dto.setProduct_code(products.getProduct_code());
        dto.setCharacter_name(products.getCharacter_name());
        dto.setPrice(products.getPrice());
        dto.setWidth(products.getWidth());
        dto.setWeight(products.getWeight());
        dto.setHeight(products.getHeight());
        dto.setType(products.getType());
        dto.setStatus(products.getStatus());
        dto.setQuantity(products.getQuantity());
        dto.setMaterial(products.getMaterial());
        dto.setTag(products.getTag());
        dto.setCreatedAt(products.getCreatedAt());
        dto.setUpdatedAt(products.getUpdatedAt());
        dto.setCategories(products.getCategories());
        dto.setProducer(products.getProducer());
        dto.setDescription(products.getDescription());
        if (products.getImage() != null) {
            dto.setImageBase64(Base64.getEncoder().encodeToString(products.getImage()));
        }
        return dto;
    }

    @GetMapping("/productsAll")
    @CrossOrigin
    public ResponseEntity<Page<ProductsDTO>> getAllProducts(Pageable pageable) {
        Page<Products> productsPage = productsService.getAll(pageable);

        Page<ProductsDTO> dtoPage = productsPage.map(this::toDTO);

        return ResponseEntity.ok(dtoPage);
    }

    @DeleteMapping("/products/{id}")
    @CrossOrigin
    String delete(@PathVariable String id) {
        productsService.delete(id);
        return " deleted successfully";
    }

    @PostMapping("/products")
    @CrossOrigin
    public ResponseEntity<?> createProduct(
            @RequestParam("name") String name,
            @RequestParam("product_code") String product_code,
            @RequestParam("character_name") String character_name,
            @RequestParam("price") BigDecimal price,
            @RequestParam("quantity") Integer quantity,
            @RequestParam("width") Double width,
            @RequestParam("height") Double height,
            @RequestParam("weight") Double weight,
            @RequestParam("type") String type,
            @RequestParam("status") String status, // có thể giữ để override nếu muốn
            @RequestParam("material") String material,
            @RequestParam("tag") String tag,
            @RequestParam("categories") Categories categories,
            @RequestParam("producer") Producer producer,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "images[]", required = false) List<MultipartFile> extraImages
    ) throws IOException {
        Products product = new Products();
        product.setName(name);
        product.setProduct_code(product_code);
        product.setCharacter_name(character_name);
        product.setPrice(price);
        product.setQuantity(quantity);
        product.setWidth(width);
        product.setHeight(height);
        product.setWeight(weight);
        product.setType(type);
        System.out.println("tôi là:" + quantity);
        // Tự động thiết lập status dựa vào quantity
        if (quantity <= 0) {
            product.setStatus("Hết hàng");
        } else if (quantity > 0) {
            product.setStatus("Còn hàng");
        } else {
            product.setStatus(status); // giữ nguyên giá trị từ request nếu không rơi vào 2 điều kiện trên
        }

        product.setMaterial(material);
        product.setTag(tag);
        product.setCategories(categories);
        product.setProducer(producer);
        product.setDescription(description);
        product.setCreatedAt(LocalDateTime.now());

        // Lưu ảnh chính
        if (image != null && !image.isEmpty()) {
            product.setImage(image.getBytes());
        }

        // Lưu danh sách ảnh phụ
        if (extraImages != null && !extraImages.isEmpty()) {
            for (MultipartFile extraImage : extraImages) {
                if (!extraImage.isEmpty()) {
                    ProductImage productImage = new ProductImage();
                    productImage.setImage(extraImage.getBytes());
                    productImage.setProduct(product);
                    product.getImages().add(productImage);
                }
            }
        }

        Products saved = productsService.save(product);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("products/search")
    @CrossOrigin
    public Page<ProductsDTO> searchProducts(
            @RequestParam(defaultValue = "") String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {

        Page<Products> productsPage = productsService.searchProductsByPrefix(name, page, size);
        return productsPage.map(ProductsDTO::new);
    }

    @PutMapping(value = "/products/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @CrossOrigin
    public Products update(@PathVariable String id,
                           @RequestParam("name") String name,
                           @RequestParam("product_code") String product_code,
                           @RequestParam("character_name") String character_name,
                           @RequestParam("price") BigDecimal price,
                           @RequestParam("quantity") Integer quantity,
                           @RequestParam("width") Double width,
                           @RequestParam("height") Double height,
                           @RequestParam("weight") Double weight,
                           @RequestParam("type") String type,
                           @RequestParam("material") String material,
                           @RequestParam("tag") String tag,
                           @RequestParam("categories") Categories categories,
                           @RequestParam("producer") Producer producer,
                           @RequestParam("description") String description,
                           @RequestParam(value = "image", required = false) MultipartFile image,
                           @RequestParam(value = "images[]", required = false) List<MultipartFile> extraImages) throws IOException {

        // Lấy bản ghi hiện tại từ DB
        Products product = productsService.findById(id);

        // Cập nhật các trường name, descriptio
        product.setName(name);
        product.setProduct_code(product_code);
        product.setCharacter_name(character_name);
        product.setPrice(price);
        product.setQuantity(quantity);
        product.setWidth(width);
        product.setHeight(height);
        product.setWeight(weight);
        product.setType(type);
        System.out.println("tôi là:" + producer);
        product.setMaterial(material);
        product.setTag(tag);
        product.setCategories(categories);
        product.setProducer(producer);
        product.setDescription(description);
        product.setCreatedAt(LocalDateTime.now());

        // Lưu ảnh chính
        if (image != null && !image.isEmpty()) {
            product.setImage(image.getBytes());
        }

        // Lưu danh sách ảnh phụ
        if (extraImages != null && !extraImages.isEmpty()) {
            for (MultipartFile extraImage : extraImages) {
                if (!extraImage.isEmpty()) {
                    ProductImage productImage = new ProductImage();
                    productImage.setImage(extraImage.getBytes());
                    productImage.setProduct(product);
                    product.getImages().add(productImage);
                }
            }
        }


        return productsService.update(id, product);
    }


    @GetMapping("/products/{id}/images")
    @CrossOrigin
    public List<Map<String, String>> getProductImages(@PathVariable String id) {
        Products product = productsRepository.findById(id).orElseThrow();
        return product.getImages().stream()
                .map(img -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("id", img.getId().toString());
                    map.put("imageData", Base64.getEncoder().encodeToString(img.getImage()));
                    return map;
                }).collect(Collectors.toList());
    }

}
