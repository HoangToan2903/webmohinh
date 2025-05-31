package mohinh.com.webmohinh_backend.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import mohinh.com.webmohinh_backend.entity.Categories;
import mohinh.com.webmohinh_backend.entity.Producer;
import mohinh.com.webmohinh_backend.entity.Products;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductsDTO {
    String id;
    String name;
    String product_code;
    String character_name;
    BigDecimal price;
    Integer quantity;
    String description;
    Double width;
    Double height;
    Double weight;
    String type;
    String status;
    String material;
    Set<String> tags;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Categories categories;
    Producer producer;
    String imageBase64;

    public ProductsDTO(Products products) {
        this.id = products.getId();
        this.product_code = products.getProduct_code();
        this.character_name = products.getCharacter_name();
        this.price = products.getPrice();
        this.quantity = products.getQuantity();
        this.width = products.getWidth();
        this.height = products.getHeight();
        this.type = products.getType();
        this.status = products.getStatus();
        this.material = products.getMaterial();
        this.tags = products.getTags();
        this.createdAt = products.getCreatedAt();
        this.updatedAt = products.getUpdatedAt();
        this.categories = products.getCategories();
        this.producer = products.getProducer();
        this.weight = products.getWeight();
        this.name = products.getName();
        this.description = products.getDescription();
        if (products.getImage() != null) {
            this.imageBase64 = Base64.getEncoder().encodeToString(products.getImage());
        }
    }
}
