package mohinh.com.webmohinh_backend.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.entity.Sale;
import mohinh.com.webmohinh_backend.entity.Voucher;
import mohinh.com.webmohinh_backend.repository.SaleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SaleService {

    SaleRepository saleRepository;
    public Sale save(Sale sale) {
        if (saleRepository.existsByName(sale.getName())) {
            System.out.println("Name đã tồn tại, không thể thêm mới."); // Ghi log thay vì ném lỗi
            return null; // Hoặc có thể trả về một giá trị mặc định
        }
        sale.setStatus(true);
        sale.setCreatedAt(LocalDateTime.now());
        return saleRepository.save(sale);
    }

    public Page<Sale> getAll(Pageable pageable) {
        return saleRepository.findAll(pageable);
    }
    public Sale update(String id, Sale sale) {
        return saleRepository.findById(id).map(existing -> {
            // Cập nhật các trường
            existing.setName(sale.getName());
            existing.setDescription(sale.getDescription());
            existing.setStartDate(sale.getStartDate());
            existing.setEndDate(sale.getEndDate());
            existing.setDiscountPercent(sale.getDiscountPercent());

            // Cập nhật thời gian chỉnh sửa
            existing.setUpdatedAt(LocalDateTime.now());

            return saleRepository.save(existing);
        }).orElse(null);
    }

    public void delete(String id){
        saleRepository.deleteById(id);
    }


    public Sale findById(String id) {
        return saleRepository.findById(id).orElseThrow(() -> new RuntimeException(" not found"));
    }

    public Page<Sale> searchSaleByPrefix(String namePrefix, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return saleRepository.findByNameStartingWithIgnoreCase(namePrefix, pageable);
    }

    public Sale updateStatus(String id, Boolean status) {
        Optional<Sale> optionalSale = saleRepository.findById(id);
        if (optionalSale.isEmpty()) {
            throw new RuntimeException("Sale not found with id: " + id);
        }

        Sale sale = optionalSale.get();
        sale.setStatus(status);
        sale.setUpdatedAt(java.time.LocalDateTime.now());
        return saleRepository.save(sale);
    }
}
