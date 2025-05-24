package mohinh.com.webmohinh_backend.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.entity.Producer;
import mohinh.com.webmohinh_backend.repository.ProducerRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProducerService {
    ProducerRepository producerRepository;


    public Producer save(Producer producer) {
        if (producerRepository.existsByName(producer.getName())) {
            System.out.println("Name đã tồn tại, không thể thêm mới."); // Ghi log thay vì ném lỗi
            return null; // Hoặc có thể trả về một giá trị mặc định
        }
        return producerRepository.save(producer);
    }

    public Page<Producer> getAll(Pageable pageable) {
        return producerRepository.findAll(pageable);
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

    public Page<Producer> searchProducersByPrefix(String namePrefix, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return producerRepository.findByNameStartingWithIgnoreCase(namePrefix, pageable);
    }
}
