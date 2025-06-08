SELECT * FROM websitemohinh.voucher;
ALTER TABLE websitemohinh.products DROP COLUMN image;
ALTER TABLE websitemohinh.products DROP COLUMN tag;
SELECT * FROM websitemohinh.products;

-- voucher
DELIMITER $$
CREATE TRIGGER trg_before_insert_or_update_voucher
BEFORE INSERT ON voucher
FOR EACH ROW
BEGIN
    IF CURDATE() < NEW.start_date THEN
        SET NEW.status = 'Chưa hoạt động';
    ELSEIF CURDATE() BETWEEN NEW.start_date AND NEW.end_date THEN
        SET NEW.status = 'Đang hoạt động';
    ELSE
        SET NEW.status = 'Ngừng hoạt động';
    END IF;

    SET NEW.created_at = IFNULL(NEW.created_at, NOW());
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_before_update_voucher
BEFORE UPDATE ON voucher
FOR EACH ROW
BEGIN
    IF CURDATE() < NEW.start_date THEN
        SET NEW.status = 'Chưa hoạt động';
    ELSEIF CURDATE() BETWEEN NEW.start_date AND NEW.end_date THEN
        SET NEW.status = 'Đang hoạt động';
    ELSE
        SET NEW.status = 'Ngừng hoạt động';
    END IF;
END$$

DELIMITER ;

SET GLOBAL event_scheduler = ON;
DELIMITER $$

CREATE EVENT evt_update_voucher_status
ON SCHEDULE EVERY 1 DAY STARTS CURRENT_DATE + INTERVAL 1 DAY
DO
BEGIN
    UPDATE voucher
    SET status = CASE
        WHEN CURDATE() < start_date THEN 'Chưa hoạt động'
        WHEN CURDATE() BETWEEN start_date AND end_date THEN 'Đang hoạt động'
        ELSE 'Ngừng hoạt động'
    END;
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


-- sale
DELIMITER $$
CREATE TRIGGER trg_before_insert_or_update_sale
BEFORE INSERT ON sale
FOR EACH ROW
BEGIN
    IF CURDATE() < NEW.start_date THEN
        SET NEW.status = 'Chưa hoạt động';
    ELSEIF CURDATE() BETWEEN NEW.start_date AND NEW.end_date THEN
        SET NEW.status = 'Đang hoạt động';
    ELSE
        SET NEW.status = 'Ngừng hoạt động';
    END IF;

    SET NEW.created_at = IFNULL(NEW.created_at, NOW());
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_before_update_sale
BEFORE UPDATE ON sale
FOR EACH ROW
BEGIN
    IF CURDATE() < NEW.start_date THEN
        SET NEW.status = 'Chưa hoạt động';
    ELSEIF CURDATE() BETWEEN NEW.start_date AND NEW.end_date THEN
        SET NEW.status = 'Đang hoạt động';
    ELSE
        SET NEW.status = 'Ngừng hoạt động';
    END IF;
END$$

DELIMITER ;

SET GLOBAL event_scheduler = ON;
DELIMITER $$

CREATE EVENT evt_update_sale_status
ON SCHEDULE EVERY 1 DAY STARTS CURRENT_DATE + INTERVAL 1 DAY
DO
BEGIN
    UPDATE sale
    SET status = CASE
        WHEN CURDATE() < start_date THEN 'Chưa hoạt động'
        WHEN CURDATE() BETWEEN start_date AND end_date THEN 'Đang hoạt động'
        ELSE 'Ngừng hoạt động'
    END;
END$$

DELIMITER ;

DROP TRIGGER IF EXISTS trg_before_insert_or_update_sale;
DROP TRIGGER IF EXISTS trg_before_update_sale;
