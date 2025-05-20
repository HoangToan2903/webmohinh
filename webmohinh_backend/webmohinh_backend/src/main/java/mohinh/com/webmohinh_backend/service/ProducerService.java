package mohinh.com.webmohinh_backend.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.entity.Categories;
import mohinh.com.webmohinh_backend.entity.Producer;
import mohinh.com.webmohinh_backend.repository.CategoriesRepository;
import mohinh.com.webmohinh_backend.repository.ProducerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProducerService {
    ProducerRepository producerRepository;


    public Producer save(Producer producer) {
        return producerRepository.save(producer);
    }

    public List<Producer> getAll(){
        return producerRepository.findAll();
    }

    public Producer update(String id, Producer producer) {
        Producer producerUpdate = findById(id);
        producerUpdate.setName(producer.getName());
        producerUpdate.setDescription(producer.getDescription());
        return producerRepository.save(producerUpdate);
    }


    public void delete(String id){
        producerRepository.deleteById(id);
    }


    public Producer findById(String id) {
        return producerRepository.findById(id).orElseThrow(() -> new RuntimeException(" not found"));
    }
}
