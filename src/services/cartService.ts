// Interfaz para los elementos del carrito
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageBase64?: string;
}

// Obtener el carrito del usuario actual
export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  const user = getCurrentUser();
  if (!user) return [];
  
  try {
    const cartKey = `cart_${user.id}`;
    const cartStr = localStorage.getItem(cartKey);
    return cartStr ? JSON.parse(cartStr) : [];
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    return [];
  }
}

// Guardar el carrito en localStorage
export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  
  const user = getCurrentUser();
  if (!user) return;
  
  try {
    const cartKey = `cart_${user.id}`;
    localStorage.setItem(cartKey, JSON.stringify(cart));
  } catch (error) {
    console.error('Error al guardar el carrito:', error);
  }
}

// Añadir producto al carrito
export function addToCart(product: any): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const cart = getCart();
    
    // Verificar si el producto ya está en el carrito
    const existingItemIndex = cart.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Incrementar la cantidad si ya existe
      cart[existingItemIndex].quantity += 1;
    } else {
      // Añadir nuevo producto al carrito
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageBase64: product.imageBase64
      });
    }
    
    saveCart(cart);
    return true;
  } catch (error) {
    console.error('Error al añadir al carrito:', error);
    return false;
  }
}

// Actualizar la cantidad de un producto en el carrito
export function updateCartItemQuantity(productId: string, quantity: number): boolean {
  if (typeof window === 'undefined') return false;
  
  if (quantity < 1) return false;
  
  try {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex >= 0) {
      cart[itemIndex].quantity = quantity;
      saveCart(cart);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al actualizar cantidad en el carrito:', error);
    return false;
  }
}

// Eliminar un producto del carrito
export function removeFromCart(productId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);
    return true;
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    return false;
  }
}

// Calcular el total del carrito
export function getCartTotal(): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  } catch (error) {
    console.error('Error al calcular el total del carrito:', error);
    return 0;
  }
}

// Obtener la cantidad total de productos en el carrito
export function getCartItemCount(): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  } catch (error) {
    console.error('Error al obtener cantidad de productos:', error);
    return 0;
  }
}

// Limpiar el carrito
export function clearCart(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    saveCart([]);
    return true;
  } catch (error) {
    console.error('Error al limpiar el carrito:', error);
    return false;
  }
}

// Función auxiliar para obtener el usuario actual
function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('freshbites_current_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
}