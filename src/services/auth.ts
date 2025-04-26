// Define interfaces for user data
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Admin user credentials
const ADMIN_USER: User = {
  id: 'admin-id',
  name: 'Administrador',
  email: 'admin@admin.com',
  password: 'admin1234',
  role: 'admin'
};

// Local storage keys
const USERS_KEY = 'freshbites_users';
const CURRENT_USER_KEY = 'freshbites_current_user';

// Initialize localStorage with admin user if not exists
export const initializeAuth = (): void => {
  if (typeof window !== 'undefined') {
    const users = localStorage.getItem(USERS_KEY);
    if (!users) {
      localStorage.setItem(USERS_KEY, JSON.stringify([ADMIN_USER]));
    }
  }
};

// Get all users from localStorage
export const getUsers = (): User[] => {
  if (typeof window !== 'undefined') {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  }
  return [];
};

// Register a new user
export const registerUser = (userData: RegisterData): { success: boolean; message: string } => {
  try {
    const users = getUsers();
    
    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
      return { success: false, message: 'El correo electrónico ya está registrado' };
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In a real app, we would hash this
      role: 'user' // All registered users are 'user' by default
    };
    
    // Save to localStorage
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    
    return { success: true, message: 'Usuario registrado correctamente' };
  } catch (error) {
    return { success: false, message: 'Error al registrar el usuario' };
  }
};

// Login a user
export const loginUser = (credentials: LoginData): { success: boolean; message: string; user?: User } => {
  try {
    const users = getUsers();
    const user = users.find(
      user => user.email === credentials.email && user.password === credentials.password
    );
    
    if (!user) {
      return { success: false, message: 'Credenciales incorrectas' };
    }
    
    // Store current user in localStorage (without password for security)
    const { password, ...safeUser } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    
    return { 
      success: true, 
      message: 'Inicio de sesión exitoso', 
      user: safeUser as User 
    };
  } catch (error) {
    return { success: false, message: 'Error al iniciar sesión' };
  }
};

// Get the current logged in user
export const getCurrentUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

// Logout the current user
export const logoutUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Check if a user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Check if current user is admin
export const isAdmin = (): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.role === 'admin';
};