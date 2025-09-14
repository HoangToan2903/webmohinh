package mohinh.com.webmohinh_backend.controller;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.dto.UpdateStatusRequest;
import mohinh.com.webmohinh_backend.entity.Sale;
import mohinh.com.webmohinh_backend.entity.Voucher;
import mohinh.com.webmohinh_backend.repository.SaleRepository;
import mohinh.com.webmohinh_backend.service.SaleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SaleController {
    SaleService saleService;
    SaleRepository saleRepository;

    @PostMapping("/sale")
    @CrossOrigin
    public Sale save(@RequestBody Sale sale) {
        return saleService.saveSale(sale);
    }

    @GetMapping("/saleAll")
    @CrossOrigin
    public Page<Sale> getAllSale(Pageable pageable) {
        return saleService.getAll(pageable);
    }

    @PutMapping("/sale/{id}")
    @CrossOrigin
    public Sale update(@PathVariable String id, @RequestBody Sale sale) {
        return saleService.update(id, sale);
    }

    @DeleteMapping("/sale/{id}")
    @CrossOrigin
    String delete(@PathVariable String id){
        saleService.delete(id);
        return " deleted successfully";
    }

    @GetMapping("sale/search")
    @CrossOrigin
    public Page<Sale> searchProducers(
            @RequestParam(defaultValue = "") String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return saleService.searchSaleByPrefix(name, page, size);
    }

    @PutMapping("/sale/{id}/status")
    @CrossOrigin
    public Sale updateStatus(@PathVariable String id, @RequestBody UpdateStatusRequest request) {
        return saleService.updateStatus(id, request.getStatus());
    }


}
