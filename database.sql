SELECT * FROM websitemohinh.voucher;
ALTER TABLE websitemohinh.products DROP COLUMN image;

SELECT * FROM websitemohinh.products;


DELIMITER $$

CREATE TRIGGER trg_before_insert_voucher
BEFORE INSERT ON voucher
FOR EACH ROW
BEGIN
    -- Tính trạng thái voucher
    IF CURDATE() < NEW.start_date THEN
        SET NEW.status = 'Chưa hoạt động ';
    ELSEIF CURDATE() BETWEEN NEW.start_date AND NEW.end_date THEN
        SET NEW.status = 'Đang hoạt động';
    ELSE
        SET NEW.status = 'Ngừng hoạt động';
    END IF;

    -- Gán thời gian tạo
    SET NEW.created_at = NOW();
END$$

DELIMITER ;
-- --status 
DELIMITER $$

CREATE TRIGGER trg_before_insert_products
BEFORE INSERT ON products
FOR EACH ROW
BEGIN
    IF NEW.quantity <= 0 THEN
        SET NEW.status = 'Hết hàng';
    ELSE
        SET NEW.status = 'Còn hàng';
    END IF;
END$$

CREATE TRIGGER trg_before_update_products
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    IF NEW.quantity <= 0 THEN
        SET NEW.status = 'Hết hàng';
    ELSE
        SET NEW.status = 'Còn hàng';
    END IF;
END$$

DELIMITER ;



