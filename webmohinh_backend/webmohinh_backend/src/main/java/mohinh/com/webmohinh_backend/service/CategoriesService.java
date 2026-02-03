package mohinh.com.webmohinh_backend.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.entity.Categories;
import mohinh.com.webmohinh_backend.repository.CategoriesRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CategoriesService {

    CategoriesRepository repository;

    public Page<Categories> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findAll(pageable);
    }

    public Categories getById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category không tồn tại với id: " + id));
    }

    @Transactional
    public Categories create(Categories categoryRequest) {
        // Thay vì tạo mới và set từng field, bạn có thể lưu trực tiếp nếu categoryRequest
        // là một Entity hợp lệ. Tuy nhiên set thủ công giúp kiểm soát dữ liệu đầu vào tốt hơn.
        Categories category = Categories.builder()
                .name(categoryRequest.getName())
                .description(categoryRequest.getDescription())
                .image(categoryRequest.getImage())
                .build();

        log.info("Đang tạo danh mục mới: {}", category.getName());
        return repository.save(category);
    }

    @Transactional
    public Categories update(String id, Categories categoryRequest) {
        Categories category = getById(id);

        // Cập nhật các thông tin cơ bản
        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());

        // Kiểm tra logic ảnh: Chỉ cập nhật nếu URL gửi lên khác với URL cũ
        if (categoryRequest.getImage() != null && !categoryRequest.getImage().isEmpty()) {
            category.setImage(categoryRequest.getImage());
        }

        log.info("Cập nhật danh mục ID: {}", id);
        return repository.save(category);
    }

    @Transactional
    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy ID để xóa: " + id);
        }
        repository.deleteById(id);
    }

    public Page<Categories> searchByName(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findByNameContaining(name, pageable);
    }
}