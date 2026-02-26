package mohinh.com.webmohinh_backend.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.dto.ProductsDTO;
import mohinh.com.webmohinh_backend.entity.*;
import mohinh.com.webmohinh_backend.repository.CategoriesRepository;
import mohinh.com.webmohinh_backend.repository.ProducerRepository;
import mohinh.com.webmohinh_backend.repository.ProductsRepository;
import mohinh.com.webmohinh_backend.repository.SaleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductsService {
    ProductsRepository productsRepository;
    SaleRepository saleRepository;
    CategoriesRepository categoriesRepository;
    ProducerRepository producerRepository;

    @Transactional
    public Products createProduct(ProductsDTO dto) {
        // 1. Khởi tạo và Map các field cơ bản
        Products product = Products.builder()
                .name(dto.getName())
                .product_code(dto.getProduct_code())
                .character_name(dto.getCharacter_name())
                .price(dto.getPrice())
                .quantity(dto.getQuantity())
                .description(dto.getDescription())
                .width(dto.getWidth())
                .height(dto.getHeight())
                .weight(dto.getWeight())
                .type(dto.getType())
                .status(dto.getStatus())
                .material(dto.getMaterial())
                .createdAt(LocalDateTime.now())// Nếu Entity dùng Set<String> hoặc @ElementCollection
                .build();
        if (dto.getTags() != null) {
            product.setTags(new HashSet<>(dto.getTags()));
        } else {
            product.setTags(new HashSet<>());
        }
        // 2. Xử lý các mối quan hệ (Lazy loading hoặc kiểm tra tồn tại)

        // Tìm Category
        if (dto.getCategories_id() != null) {
            Categories cat = categoriesRepository.findById(dto.getCategories_id())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + dto.getCategories_id()));
            product.setCategories(cat);
        }

        // Tìm Producer
        if (dto.getProducer_id() != null) {
            Producer producer = producerRepository.findById(dto.getProducer_id())
                    .orElseThrow(() -> new RuntimeException("Producer not found"));
            product.setProducer(producer);
        }

        // Tìm Sale (Nếu có)
        if (dto.getSale_id() != null) {
            Sale sale = saleRepository.findById(dto.getSale_id()).orElse(null);
            product.setSale(sale);
        }

        // 3. Xử lý danh sách ảnh (Quan hệ Bidirectional)
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            List<ProductImage> productImages = dto.getImageUrls().stream()
                    .map(url -> {
                        ProductImage img = new ProductImage();
                        img.setImageUrl(url);
                        img.setProduct(product); // Quan trọng: Phải set ngược lại Product cho Image
                        return img;
                    }).collect(Collectors.toList());

            product.setImages(productImages);
        }

        // 4. Lưu vào Database
        return productsRepository.save(product);
    }
    public Page<Products> getAll(int page, int size) {
        return productsRepository.findAll(PageRequest.of(page, size));
    }
    @Transactional
    public Products update(String id, ProductsDTO dto) {
        // 1. Tìm sản phẩm cũ, nếu không có thì throw lỗi
        Products product = productsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));

        // 2. Cập nhật các thông tin cơ bản từ DTO
        product.setName(dto.getName());
        product.setProduct_code(dto.getProduct_code());
        product.setCharacter_name(dto.getCharacter_name());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setDescription(dto.getDescription());
        product.setWidth(dto.getWidth());
        product.setHeight(dto.getHeight());
        product.setWeight(dto.getWeight());
        product.setType(dto.getType());
        product.setStatus(dto.getStatus());
        product.setMaterial(dto.getMaterial());
        product.setTags(dto.getTags());


        // 3. Cập nhật các mối quan hệ (Category, Producer, Sale)
        if (dto.getCategories_id() != null) {
            Categories category = categoriesRepository.findById(dto.getCategories_id())
                    .orElseThrow(() -> new RuntimeException("Category không tồn tại"));
            product.setCategories(category);
        }

        if (dto.getProducer_id() != null) {
            Producer producer = producerRepository.findById(dto.getProducer_id())
                    .orElseThrow(() -> new RuntimeException("Producer không tồn tại"));
            product.setProducer(producer);
        }

        // 4. Xử lý cập nhật danh sách hình ảnh (Logic quan trọng)
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            // Xóa các ảnh cũ không còn nằm trong danh sách mới (nếu cần)
            // Hoặc đơn giản là thay thế toàn bộ danh sách mới:

            // Giả sử ProductImage là một Entity riêng có quan hệ @OneToMany với Product
            product.getImages().clear(); // Xóa list ảnh hiện tại

            List<ProductImage> newImages = dto.getImageUrls().stream()
                    .map(url -> ProductImage.builder()
                            .imageUrl(url)
                            .product(product)
                            .build())
                    .collect(Collectors.toList());

            product.getImages().addAll(newImages);
        }

        log.info("Cập nhật sản phẩm ID: {} thành công", id);
        return productsRepository.save(product);
    }

    public void delete(String id){
        productsRepository.deleteById(id);
    }

    public Products findById(String id) {
        return productsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
    }
    public Page<Products> searchProductsByPrefix(String namePrefix, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return productsRepository.findByNameStartingWithIgnoreCase(namePrefix, pageable);
    }


    public Products addOrUpdateSaleToProduct(String productId, String saleId) {
        Products product = productsRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        if (saleId == null) {
            // Nếu saleId là null, gỡ sale
            product.setSale(null);
        } else {
            Sale sale = saleRepository.findById(saleId)
                    .orElseThrow(() -> new RuntimeException("Sale not found with ID: " + saleId));
            product.setSale(sale); // Gán sale mới
        }

        return productsRepository.save(product); // Lưu thay đổi
    }

    public Page<Products> getProductsByCategoryId(String categoryId, Pageable pageable) {
        return productsRepository.findAllByCategoryId(categoryId, pageable);
    }
    public Optional<Products> getProductById(String idProducts) {
        return productsRepository.findById(idProducts);
    }

}
