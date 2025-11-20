import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginForm.css';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/chatbot');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Iniciar Sesión</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@example.com"
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              disabled={isLoading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="demo-credentials">
          <p className="demo-title">Credenciales de prueba:</p>
          <p><strong>Email:</strong> usuario@example.com</p>
          <p><strong>Contraseña:</strong> password123</p>
          <p style={{ marginTop: '10px' }}><strong>O también:</strong></p>
          <p><strong>Email:</strong> demo@test.com</p>
          <p><strong>Contraseña:</strong> demo123</p>
        </div>
      </div>
    </div>
  );
};