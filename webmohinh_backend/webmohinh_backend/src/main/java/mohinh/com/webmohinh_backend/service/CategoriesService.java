package mohinh.com.webmohinh_backend.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.entity.Categories;
import mohinh.com.webmohinh_backend.entity.Producer;
import mohinh.com.webmohinh_backend.repository.CategoriesRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CategoriesService {

    CategoriesRepository categoriesRepository;


    public Categories save(Categories categories) {
        if (categoriesRepository.existsByName(categories.getName())) {
            System.out.println("Name đã tồn tại, không thể thêm mới."); // Ghi log thay vì ném lỗi
            return null; // Hoặc có thể trả về một giá trị mặc định
        }
        return categoriesRepository.save(categories);
    }


    public Page<Categories> getAll(Pageable pageable) {
        return categoriesRepository.findAll(pageable);
    }


    public Categories update(String id, Categories categories) {
        Categories categoriesUpdate = findById(id);
        categoriesUpdate.setName(categories.getName());
        categoriesUpdate.setDescription(categories.getDescription());
        categoriesUpdate.setImage(categories.getImage());

        return categoriesRepository.save(categoriesUpdate);
    }



    public void delete(String id){
        categoriesRepository.deleteById(id);
    }


    public Categories findById(String id) {
        return categoriesRepository.findById(id).orElseThrow(() -> new RuntimeException(" not found"));
    }
    public Page<Categories> searchCategoriesByPrefix(String namePrefix, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return categoriesRepository.findByNameStartingWithIgnoreCase(namePrefix, pageable);
    }
}
