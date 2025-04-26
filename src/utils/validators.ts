// Email validation using regular expression
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if a string is empty
export const isEmpty = (value: string): boolean => {
  return value.trim() === '';
};

// Check if passwords match
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

// Validate minimum password length
export const isPasswordValid = (password: string, minLength = 6): boolean => {
  return password.length >= minLength;
};

// Validate login form
export const validateLoginForm = (email: string, password: string): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (isEmpty(email)) {
    errors.email = 'El correo electrónico es requerido';
  } else if (!isValidEmail(email)) {
    errors.email = 'Ingrese un correo electrónico válido';
  }
  
  if (isEmpty(password)) {
    errors.password = 'La contraseña es requerida';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate registration form
export const validateRegisterForm = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (isEmpty(name)) {
    errors.name = 'El nombre es requerido';
  }
  
  if (isEmpty(email)) {
    errors.email = 'El correo electrónico es requerido';
  } else if (!isValidEmail(email)) {
    errors.email = 'Ingrese un correo electrónico válido';
  }
  
  if (isEmpty(password)) {
    errors.password = 'La contraseña es requerida';
  } else if (!isPasswordValid(password)) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }
  
  if (isEmpty(confirmPassword)) {
    errors.confirmPassword = 'Confirme su contraseña';
  } else if (!doPasswordsMatch(password, confirmPassword)) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};