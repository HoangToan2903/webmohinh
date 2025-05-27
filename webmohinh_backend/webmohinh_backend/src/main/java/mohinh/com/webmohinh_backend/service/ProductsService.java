package mohinh.com.webmohinh_backend.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.entity.Categories;
import mohinh.com.webmohinh_backend.entity.Producer;
import mohinh.com.webmohinh_backend.entity.Products;
import mohinh.com.webmohinh_backend.repository.ProductsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductsService {
    ProductsRepository productsRepository;


    public Products save(Products products) {
        if (productsRepository.existsByName(products.getName())) {
            System.out.println("Name đã tồn tại, không thể thêm mới."); // Ghi log thay vì ném lỗi
            return null; // Hoặc có thể trả về một giá trị mặc định
        }
        return productsRepository.save(products);
    }

    public Page<Products> getAll(Pageable pageable) {
        return productsRepository.findAll(pageable);
    }

    public Products update(String id, Products products) {
        Products usersproducts= findById(id);
        usersproducts.setName(products.getName());
        usersproducts.setPrice(products.getPrice());
        usersproducts.setQuantity(products.getQuantity());
        usersproducts.setDescription(products.getDescription());
        usersproducts.setImage(products.getImage());
        usersproducts.setCategories(products.getCategories());
        usersproducts.setCreatedAt(products.getCreatedAt());
        usersproducts.setProducer(products.getProducer());
        usersproducts.setCharacter_name(products.getCharacter_name());
        usersproducts.setWidth(products.getWidth());
        usersproducts.setWeight(products.getWeight());
        usersproducts.setHeight(products.getHeight());
        usersproducts.setProduct_code(products.getProduct_code());
        usersproducts.setMaterial(products.getMaterial());
        usersproducts.setTag(products.getTag());
        usersproducts.setUpdatedAt(LocalDateTime.now());

        return productsRepository.save(usersproducts);
    }


    public void delete(String id){
        productsRepository.deleteById(id);
    }


    public Products findById(String id) {
        return productsRepository.findById(id).orElseThrow(() -> new RuntimeException(" not found"));
    }
    public Page<Products> searchProductsByPrefix(String namePrefix, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return productsRepository.findByNameStartingWithIgnoreCase(namePrefix, pageable);
    }
}
