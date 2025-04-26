// Interfaz para la categoría
export interface Category {
  id: string;
  name: string;
}

// Clave para el almacenamiento en localStorage
const CATEGORIES_KEY = 'categories';

// Obtener todas las categorías
export const getCategories = (): Category[] => {
  if (typeof window !== 'undefined') {
    const categoriesStr = localStorage.getItem(CATEGORIES_KEY);
    return categoriesStr ? JSON.parse(categoriesStr) : [];
  }
  return [];
};

// Guardar categorías
const saveCategories = (categories: Category[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }
};

// Crear una nueva categoría
export const createCategory = (name: string): { success: boolean; message: string; category?: Category } => {
  try {
    const categories = getCategories();
    
    // Verificar si ya existe una categoría con el mismo nombre
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
      return { 
        success: false, 
        message: 'Ya existe una categoría con este nombre' 
      };
    }
    
    // Crear nueva categoría
    const newCategory: Category = {
      id: Date.now().toString(),
      name
    };
    
    // Guardar en localStorage
    saveCategories([...categories, newCategory]);
    
    return { 
      success: true, 
      message: 'Categoría creada correctamente', 
      category: newCategory 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'Error al crear la categoría' 
    };
  }
};

// Actualizar una categoría existente
export const updateCategory = (id: string, name: string): { success: boolean; message: string } => {
  try {
    const categories = getCategories();
    
    // Verificar si ya existe otra categoría con el mismo nombre
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase() && cat.id !== id)) {
      return { 
        success: false, 
        message: 'Ya existe otra categoría con este nombre' 
      };
    }
    
    // Encontrar y actualizar la categoría
    const updatedCategories = categories.map(cat => 
      cat.id === id ? { ...cat, name } : cat
    );
    
    // Verificar si la categoría fue encontrada
    if (JSON.stringify(categories) === JSON.stringify(updatedCategories)) {
      return { 
        success: false, 
        message: 'Categoría no encontrada' 
      };
    }
    
    // Guardar en localStorage
    saveCategories(updatedCategories);
    
    return { 
      success: true, 
      message: 'Categoría actualizada correctamente' 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'Error al actualizar la categoría' 
    };
  }
};

// Eliminar una categoría
export const deleteCategory = (id: string): { success: boolean; message: string } => {
  try {
    const categories = getCategories();
    const filteredCategories = categories.filter(cat => cat.id !== id);
    
    // Verificar si la categoría fue encontrada
    if (categories.length === filteredCategories.length) {
      return { 
        success: false, 
        message: 'Categoría no encontrada' 
      };
    }
    
    // Guardar en localStorage
    saveCategories(filteredCategories);
    
    return { 
      success: true, 
      message: 'Categoría eliminada correctamente' 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'Error al eliminar la categoría' 
    };
  }
};

// Obtener una categoría por ID
export const getCategoryById = (id: string): Category | null => {
  const categories = getCategories();
  return categories.find(cat => cat.id === id) || null;
};