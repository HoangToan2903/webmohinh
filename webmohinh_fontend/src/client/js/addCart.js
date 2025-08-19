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

export const getCart = () => {
    try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch {
        return [];
    }
};

export const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// ✅ Thêm sản phẩm vào giỏ (cộng dồn chứ không ghi đè)
export const addToCart = (product, quantity = 1) => {
    const cart = getCart();
    const index = cart.findIndex(item => item.id === product.id);

    if (index !== -1) {
        cart[index].quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    console.log("📦 Giỏ hàng sau khi thêm:", cart);

    saveCart(cart);
    window.dispatchEvent(new Event("cartUpdated"));
};


// ✅ Xoá sản phẩm
export const removeFromCart = (productId) => {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
};
