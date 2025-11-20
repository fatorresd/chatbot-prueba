import type { User, LoginCredentials } from '../types/auth';

// Credenciales válidas simuladas
const VALID_USERS = [
  { email: 'usuario@example.com', password: 'password123' },
  { email: 'demo@test.com', password: 'demo123' },
];

// Simular una llamada a API
export const mockLoginAPI = async (
  credentials: LoginCredentials
): Promise<User> => {
  // Simular delay de red (500ms)
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = VALID_USERS.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    throw new Error('Email o contraseña inválidos');
  }

  // Retornar usuario simulado
  return {
    id: Math.random().toString(36).substr(2, 9),
    email: credentials.email,
    name: credentials.email.split('@')[0].charAt(0).toUpperCase() + 
          credentials.email.split('@')[0].slice(1),
  };
};

// Guardar token en localStorage
export const saveToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// Obtener token de localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Limpiar token
export const clearToken = (): void => {
  localStorage.removeItem('auth_token');
};