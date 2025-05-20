package mohinh.com.webmohinh_backend.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.entity.Categories;
import mohinh.com.webmohinh_backend.repository.CategoriesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CategoriesService {

    CategoriesRepository categoriesRepository;


    public Categories save(Categories categories) {
        return categoriesRepository.save(categories);
    }

    public List<Categories> getAll(){
        return categoriesRepository.findAll();
    }

    public Categories update(String id, Categories categories) {
        Categories categoriesUpdate = findById(id);
        categoriesUpdate.setName(categories.getName());
        categoriesUpdate.setDescription(categories.getDescription());
        return categoriesRepository.save(categoriesUpdate);
    }


    public void delete(String id){
        categoriesRepository.deleteById(id);
    }


    public Categories findById(String id) {
        return categoriesRepository.findById(id).orElseThrow(() -> new RuntimeException(" not found"));
    }

}
