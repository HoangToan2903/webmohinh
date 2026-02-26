import Cookies from 'js-cookie';

// ✅ Resize ảnh từ File sang base64 gọn nhẹ
export const resizeImageToBase64 = (file, maxWidth = 80, maxHeight = 80, quality = 0.4) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    const scale = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.floor(width * scale);
                    height = Math.floor(height * scale);
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                const base64 = canvas.toDataURL("image/jpeg", quality);
                resolve(base64);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
// ✅ Chuyển base64 thành File
export const base64ToFile = (base64String, filename = "image.jpg") => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};
// ✅ Lấy giỏ hàng

// ✅ Lấy giỏ hàng (kiểm tra hết hạn)
export const getCart = () => {
  try {
    const data = localStorage.getItem('cart');
    if (!data) return [];

    const parsed = JSON.parse(data);

    // Nếu quá hạn thì xóa
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem('cart');
      return [];
    }

    return parsed.cart || [];
  } catch {
    return [];
  }
};

export const saveCart = (cart) => {
  const expiresAt = Date.now() + 2 * 24 * 60 * 60 * 1000; // 2 ngày (ms)
  const data = { cart, expiresAt };
  localStorage.setItem('cart', JSON.stringify(data));
};


// ✅ Thêm sản phẩm vào giỏ (cộng dồn chứ không ghi đè)
// ✅ Thêm sản phẩm vào giỏ (Đảm bảo lưu đúng thông tin ảnh)
export const addToCart = (product, quantity = 1) => {
    const cart = getCart();
    const index = cart.findIndex(item => item.id === product.id);

    if (index !== -1) {
        cart[index].quantity += quantity;
        // Cập nhật lại giá hoặc ảnh mới nhất nếu cần
        cart[index].price = product.price; 
        cart[index].image = product.image; 
    } else {
        cart.push({ 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            image: product.image, // Lưu URL hoặc chuỗi base64 đã xử lý
            quantity 
        });
    }

    saveCart(cart);
    // Phát sự kiện để các component khác (như Icon giỏ hàng) cập nhật số lượng
    window.dispatchEvent(new Event("cartUpdated"));
};

// ✅ Xoá sản phẩm
export const removeFromCart = (productId) => {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
};
