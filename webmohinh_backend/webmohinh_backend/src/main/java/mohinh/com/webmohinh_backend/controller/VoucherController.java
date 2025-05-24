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
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VoucherController {
    VoucherService voucherService;

    @PostMapping("/voucher")
    @CrossOrigin
    public Voucher save(@RequestBody Voucher voucher) {
        return voucherService.save(voucher);
    }

    @GetMapping("/voucherAll")
    @CrossOrigin
    public Page<Voucher> getAllVouchers(Pageable pageable) {
        return voucherService.getAll(pageable);
    }

    @PutMapping("/voucher/{id}")
    @CrossOrigin
    public Voucher update(@PathVariable String id, @RequestBody Voucher voucher) {
        return voucherService.update(id, voucher);
    }

    @DeleteMapping("/voucher/{id}")
    @CrossOrigin
    String delete(@PathVariable String id){
        voucherService.delete(id);
        return " deleted successfully";
    }

    @GetMapping("voucher/search")
    @CrossOrigin
    public Page<Voucher> searchProducers(
            @RequestParam(defaultValue = "") String codeVoucher,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return voucherService.searchVocherByPrefix(codeVoucher, page, size);
    }
}
