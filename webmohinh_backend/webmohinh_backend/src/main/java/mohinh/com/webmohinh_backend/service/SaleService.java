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
        // Xác định ngày hiện tại
        LocalDate today = LocalDate.now();
        LocalDate startDate = sale.getStartDate();
        LocalDate endDate = sale.getEndDate();

        // Tính toán status dựa vào ngày hiện tại
        if (today.isBefore(startDate)) {
            sale.setStatus("Chưa hoạt động");
        } else if ((today.isEqual(startDate) || today.isAfter(startDate)) && (today.isBefore(endDate) || today.isEqual(endDate))) {
            sale.setStatus("Đang hoạt động");
        } else if (today.isAfter(endDate)) {
            sale.setStatus("Ngừng hoạt động");
        }
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

            // Cập nhật lại status dựa vào ngày hiện tại
            LocalDate today = LocalDate.now();
            LocalDate startDate = sale.getStartDate();
            LocalDate endDate = sale.getEndDate();

            if (today.isBefore(startDate)) {
                existing.setStatus("Chưa hoạt động");
            } else if (!today.isAfter(endDate)) {
                existing.setStatus("Đang hoạt động");
            } else {
                existing.setStatus("Ngừng hoạt động");
            }

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

    public Page<Sale> searchVocherByPrefix(String namePrefix, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("codeVoucher").ascending());
        return saleRepository.findByNameStartingWithIgnoreCase(namePrefix, pageable);
    }

}
