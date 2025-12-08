package mohinh.com.webmohinh_backend.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.entity.Producer;
import mohinh.com.webmohinh_backend.entity.Voucher;
import mohinh.com.webmohinh_backend.service.ProducerService;
import mohinh.com.webmohinh_backend.service.VoucherService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class VoucherController {
    VoucherService voucherService;

    @PostMapping("/voucher")
    public Voucher save(@RequestBody Voucher voucher) {
        return voucherService.save(voucher);
    }

    @GetMapping("/voucherAll")
    public Page<Voucher> getAllVouchers(Pageable pageable) {
        return voucherService.getAll(pageable);
    }

    @PutMapping("/voucher/{id}")
    public Voucher update(@PathVariable String id, @RequestBody Voucher voucher) {
        return voucherService.update(id, voucher);
    }

    @DeleteMapping("/voucher/{id}")
    String delete(@PathVariable String id){
        voucherService.delete(id);
        return " deleted successfully";
    }

    @GetMapping("voucher/search")
    public Page<Voucher> searchProducers(
            @RequestParam(defaultValue = "") String codeVoucher,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return voucherService.searchVocherByPrefix(codeVoucher, page, size);
    }

    @GetMapping("/voucher/{id}")
    public ResponseEntity<Voucher> getVoucherById(@PathVariable String id) {
        Voucher voucher = voucherService.findById(id);
        return ResponseEntity.ok(voucher);
    }
}
