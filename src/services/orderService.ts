import { CartItem, clearCart, getCart, getCartTotal } from './cartService';

// Interfaz para un pedido
export interface Order {
  id: string;
  userId: string;
  userName: string;
  date: string;
  items: CartItem[];
  total: number;
}

// Generar un ID único para los pedidos
function generateOrderId(): string {
  return 'order-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Obtener todos los pedidos guardados
export function getAllOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const ordersStr = localStorage.getItem('orders');
    return ordersStr ? JSON.parse(ordersStr) : [];
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return [];
  }
}

// Guardar la lista de pedidos
function saveOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('orders', JSON.stringify(orders));
  } catch (error) {
    console.error('Error al guardar pedidos:', error);
  }
}

// Crear un nuevo pedido a partir del carrito actual
export function createOrderFromCart(): Order | null {
  if (typeof window === 'undefined') return null;
  
  const user = getCurrentUser();
  if (!user) return null;
  
  const cart = getCart();
  if (cart.length === 0) return null;
  
  const total = getCartTotal();
  
  const newOrder: Order = {
    id: generateOrderId(),
    userId: user.id,
    userName: user.name,
    date: new Date().toISOString(),
    items: [...cart],
    total
  };
  
  try {
    // Añadir el nuevo pedido a la lista de pedidos
    const orders = getAllOrders();
    orders.push(newOrder);
    saveOrders(orders);
    
    // Limpiar el carrito después de crear el pedido
    clearCart();
    
    return newOrder;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    return null;
  }
}

// Obtener los pedidos del usuario actual
export function getUserOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  
  const user = getCurrentUser();
  if (!user) return [];
  
  try {
    const allOrders = getAllOrders();
    return allOrders
      .filter(order => order.userId === user.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Ordenar por fecha descendente
  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    return [];
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