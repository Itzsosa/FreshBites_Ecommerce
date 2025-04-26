// Interfaz para el producto
export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  categoryId: string;
  imageBase64?: string;
}

// Clave para el almacenamiento en localStorage
const PRODUCTS_KEY = 'products';

// Obtener todos los productos
export const getProducts = (): Product[] => {
  if (typeof window !== 'undefined') {
    try {
      const productsStr = localStorage.getItem(PRODUCTS_KEY);
      console.log('Obteniendo productos de localStorage:', productsStr);
      return productsStr ? JSON.parse(productsStr) : [];
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return [];
    }
  }
  return [];
};

// Guardar productos
const saveProducts = (products: Product[]): void => {
  if (typeof window !== 'undefined') {
    try {
      console.log('Guardando productos en localStorage:', products);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error al guardar productos:', error);
    }
  }
};

// Inicializar el almacenamiento de productos si no existe
export const initializeProducts = (): void => {
  if (typeof window !== 'undefined') {
    const productsStr = localStorage.getItem(PRODUCTS_KEY);
    if (!productsStr) {
      console.log('Inicializando array de productos');
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify([]));
    }
  }
};

// Crear un nuevo producto
export const createProduct = (product: Omit<Product, 'id'>): { success: boolean; message: string; product?: Product } => {
  try {
    // Inicializar productos si no existen
    initializeProducts();
    
    const products = getProducts();
    
    // Verificar si ya existe un producto con el mismo nombre
    if (products.some(prod => prod.name.toLowerCase() === product.name.toLowerCase())) {
      return { 
        success: false, 
        message: 'Ya existe un producto con este nombre' 
      };
    }
    
    // Validar que el precio sea positivo
    if (product.price <= 0) {
      return {
        success: false,
        message: 'El precio debe ser un número positivo'
      };
    }
    
    // Validar la descripción si está presente
    if (product.description && product.description.length < 10) {
      return {
        success: false,
        message: 'La descripción debe tener al menos 10 caracteres'
      };
    }
    
    // Crear nuevo producto
    const newProduct: Product = {
      id: Date.now().toString(),
      ...product
    };
    
    // Preparar array actualizado de productos
    const updatedProducts = [...products, newProduct];
    
    // Guardar en localStorage
    saveProducts(updatedProducts);
    
    // Verificar que se guardó correctamente
    const savedProducts = getProducts();
    console.log('Productos después de guardar:', savedProducts);
    
    return { 
      success: true, 
      message: 'Producto creado correctamente', 
      product: newProduct 
    };
  } catch (error) {
    console.error('Error en createProduct:', error);
    return { 
      success: false, 
      message: 'Error al crear el producto' 
    };
  }
};

// Actualizar un producto existente
export const updateProduct = (id: string, productData: Omit<Product, 'id'>): { success: boolean; message: string } => {
  try {
    const products = getProducts();
    
    // Verificar si ya existe otro producto con el mismo nombre
    if (products.some(prod => prod.name.toLowerCase() === productData.name.toLowerCase() && prod.id !== id)) {
      return { 
        success: false, 
        message: 'Ya existe otro producto con este nombre' 
      };
    }
    
    // Validar que el precio sea positivo
    if (productData.price <= 0) {
      return {
        success: false,
        message: 'El precio debe ser un número positivo'
      };
    }
    
    // Validar la descripción si está presente
    if (productData.description && productData.description.length < 10) {
      return {
        success: false,
        message: 'La descripción debe tener al menos 10 caracteres'
      };
    }
    
    // Encontrar y actualizar el producto
    const updatedProducts = products.map(prod => 
      prod.id === id ? { ...prod, ...productData, id } : prod
    );
    
    // Verificar si el producto fue encontrado
    if (JSON.stringify(products) === JSON.stringify(updatedProducts)) {
      return { 
        success: false, 
        message: 'Producto no encontrado' 
      };
    }
    
    // Guardar en localStorage
    saveProducts(updatedProducts);
    
    return { 
      success: true, 
      message: 'Producto actualizado correctamente' 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'Error al actualizar el producto' 
    };
  }
};

// Eliminar un producto
export const deleteProduct = (id: string): { success: boolean; message: string } => {
  try {
    const products = getProducts();
    const filteredProducts = products.filter(prod => prod.id !== id);
    
    // Verificar si el producto fue encontrado
    if (products.length === filteredProducts.length) {
      return { 
        success: false, 
        message: 'Producto no encontrado' 
      };
    }
    
    // Guardar en localStorage
    saveProducts(filteredProducts);
    
    return { 
      success: true, 
      message: 'Producto eliminado correctamente' 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'Error al eliminar el producto' 
    };
  }
};

// Obtener un producto por ID
export const getProductById = (id: string): Product | null => {
  const products = getProducts();
  return products.find(prod => prod.id === id) || null;
};