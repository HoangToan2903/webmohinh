package mohinh.com.webmohinh_backend.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.entity.Producer;
import mohinh.com.webmohinh_backend.service.ProducerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProducerController {

    ProducerService producerService;

    @PostMapping("/producer")
    @CrossOrigin
    public Producer save(@RequestBody Producer producer) {
        return producerService.save(producer);
    }

    @GetMapping("/producerAll")
    @CrossOrigin
    public Page<Producer> getAllProducers(Pageable pageable) {
        return producerService.getAll(pageable);
    }

    @PutMapping("/producer/{id}")
    @CrossOrigin
    public Producer update(@PathVariable String id, @RequestBody Producer producer) {
        return producerService.update(id, producer);
    }

    @DeleteMapping("/producer/{id}")
    @CrossOrigin
    String delete(@PathVariable String id){
        producerService.delete(id);
        return " deleted successfully";
    }

    @GetMapping("producer/search")
    @CrossOrigin
    public Page<Producer> searchProducers(
            @RequestParam(defaultValue = "") String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return producerService.searchProducersByPrefix(name, page, size);
    }
}
