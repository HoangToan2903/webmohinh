package mohinh.com.webmohinh_backend.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.entity.Producer;
import mohinh.com.webmohinh_backend.entity.Voucher;
import mohinh.com.webmohinh_backend.repository.ProducerRepository;
import mohinh.com.webmohinh_backend.repository.VoucherRepository;
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
public class VoucherService {
    VoucherRepository voucherRepository;


    public Voucher save(Voucher voucher) {
        if (voucherRepository.existsByCodeVoucher(voucher.getCodeVoucher())) {
            System.out.println("Code đã tồn tại, không thể thêm mới."); // Ghi log thay vì ném lỗi
            return null; // Hoặc có thể trả về một giá trị mặc định
        }
        // Xác định ngày hiện tại
        LocalDate today = LocalDate.now();
        LocalDate startDate = voucher.getStart_date();
        LocalDate endDate = voucher.getEnd_date();

        // Tính toán status dựa vào ngày hiện tại
        if (today.isBefore(startDate)) {
            voucher.setStatus("Inactive");
        } else if ((today.isEqual(startDate) || today.isAfter(startDate)) && (today.isBefore(endDate) || today.isEqual(endDate))) {
            voucher.setStatus("Active");
        } else if (today.isAfter(endDate)) {
            voucher.setStatus("Deactivated");
        }
        voucher.setCreated_at(LocalDateTime.now());
        return voucherRepository.save(voucher);
    }

    public Page<Voucher> getAll(Pageable pageable) {
        return voucherRepository.findAll(pageable);
    }
    public Voucher update(String id, Voucher updatedVoucher) {
        return voucherRepository.findById(id).map(existing -> {
            // Cập nhật các trường
            existing.setCodeVoucher(updatedVoucher.getCodeVoucher());
            existing.setDescription(updatedVoucher.getDescription());
            existing.setReduced_value(updatedVoucher.getReduced_value());
            existing.setConditions_apply(updatedVoucher.getConditions_apply());
            existing.setQuantity(updatedVoucher.getQuantity());
            existing.setStart_date(updatedVoucher.getStart_date());
            existing.setEnd_date(updatedVoucher.getEnd_date());

            // Cập nhật lại status dựa vào ngày hiện tại
            LocalDate today = LocalDate.now();
            LocalDate startDate = updatedVoucher.getStart_date();
            LocalDate endDate = updatedVoucher.getEnd_date();

            if (today.isBefore(startDate)) {
                existing.setStatus("Inactive");
            } else if (!today.isAfter(endDate)) {
                existing.setStatus("Active");
            } else {
                existing.setStatus("Deactivated");
            }

            // Cập nhật thời gian chỉnh sửa
            existing.setUpdate_at(LocalDateTime.now());

            return voucherRepository.save(existing);
        }).orElse(null);
    }

    public void delete(String id){
        voucherRepository.deleteById(id);
    }


    public Voucher findById(String id) {
        return voucherRepository.findById(id).orElseThrow(() -> new RuntimeException(" not found"));
    }

    public Page<Voucher> searchVocherByPrefix(String codeVocherPrefix, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("codeVoucher").ascending());
        return voucherRepository.findByCodeVoucherStartingWithIgnoreCase(codeVocherPrefix, pageable);
    }
}
