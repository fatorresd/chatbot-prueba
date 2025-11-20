import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px 20px' }}>
      <h1>404 - Página No Encontrada</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/login">Volver al Login</Link>
    </div>
  );
};