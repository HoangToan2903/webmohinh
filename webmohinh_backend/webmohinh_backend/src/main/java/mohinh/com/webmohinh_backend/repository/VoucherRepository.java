package mohinh.com.webmohinh_backend.repository;


import mohinh.com.webmohinh_backend.entity.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoucherRepository extends JpaRepository<Voucher, String> {
    boolean existsByCodeVoucher(String codeVoucher);
    // Tìm kiếm theo tên có phân trang (trả về Page)
    Page<Voucher> findByCodeVoucherStartingWithIgnoreCase(String codeVocherPrefix, Pageable pageable);
}
