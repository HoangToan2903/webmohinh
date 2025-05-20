package mohinh.com.webmohinh_backend.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.entity.Products;
import mohinh.com.webmohinh_backend.repository.ProductsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductsService {
    ProductsRepository productsRepository;


    public Products save(Products users) {
        return productsRepository.save(users);
    }

    public List<Products> getAll(){
        return productsRepository.findAll();
    }

    public Products update(String id, Products users) {
        Products usersUpdate = findById(id);
        usersUpdate.setName(users.getName());
        usersUpdate.setPrice(users.getPrice());
        usersUpdate.setQuantity(users.getQuantity());
        usersUpdate.setDescription(users.getDescription());
        usersUpdate.setImage(users.getImage());
        usersUpdate.setCategories(users.getCategories());
        usersUpdate.setCreatedAt(users.getCreatedAt());
        usersUpdate.setProducer(users.getProducer());
        return productsRepository.save(usersUpdate);
    }


    public void delete(String id){
        productsRepository.deleteById(id);
    }


    public Products findById(String id) {
        return productsRepository.findById(id).orElseThrow(() -> new RuntimeException(" not found"));
    }
}
