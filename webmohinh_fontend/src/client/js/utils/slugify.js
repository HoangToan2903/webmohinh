const slugify = (str) => {
  if (typeof str !== 'string') {
    console.error('Input is not a string:', str);
    return ''; // Trả về chuỗi rỗng nếu input không phải là chuỗi
  }

  return str
    .toLowerCase()  // Chuyển sang chữ thường
    .normalize("NFD")  // Chuyển thành dạng chuẩn hóa Unicode
    .replace(/[\u0300-\u036f]/g, "")  // Loại bỏ dấu (accents)
    .replace(/[^a-z0-9 ]/g, "")  // Loại bỏ ký tự không phải chữ cái, số và dấu cách
    .trim()  // Loại bỏ khoảng trắng ở đầu và cuối
    .replace(/\s+/g, "-");  // Thay thế khoảng trắng bằng dấu gạch ngang
};

export default slugify;