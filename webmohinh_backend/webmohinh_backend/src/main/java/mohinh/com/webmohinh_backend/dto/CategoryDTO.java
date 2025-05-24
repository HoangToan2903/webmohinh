package mohinh.com.webmohinh_backend.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import mohinh.com.webmohinh_backend.entity.Categories;

import java.util.Base64;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryDTO {
    String id;
    String name;
    String description;
    String imageBase64;

    //    public CategoryDTO toDTO(Categories category) {
//        CategoryDTO dto = new CategoryDTO();
//        dto.setId(category.getId());
//        dto.setName(category.getName());
//        dto.setDescription(category.getDescription());
//        if (category.getImage() != null) {
//            dto.setImageBase64(Base64.getEncoder().encodeToString(category.getImage()));
//        }
//        return dto;
//    }
    public CategoryDTO(Categories category) {
        this.id = category.getId();
        this.name = category.getName();
        this.description = category.getDescription();
        if (category.getImage() != null) {
            this.imageBase64 = Base64.getEncoder().encodeToString(category.getImage());
        }
    }
}
