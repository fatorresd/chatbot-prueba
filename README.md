
# ChatBot - Frontend

Aplicación frontend de un sistema de chatbot con gestión de citas médicas, desarrollada con React, TypeScript y Vite.

##  Características

- Sistema de autenticación con JWT
- Chat interactivo para gestión de citas médicas
- Visualización y gestión de citas programadas
- Rutas protegidas
- Interfaz responsive

##  Requisitos Previos

- Ejecutar primero el Backend

- Node.js (versión 20.19.0 o superior)
- npm (versión 8.0.0 o superior)

## Instalación

```bash
git clone https://github.com/fatorresd/chatbot-prueba.git
cd chatbot-prueba
npm install
```
## Crear .env para ejecutar en local
- Asi debe lucir el .env
  
```bash
VITE_API_URL=http://localhost:3001/api
```

## Desarrollo

```bash
npm run dev
```

# Dependencias

- react-router-dom: Para manejar rutas (Login, Dashboard, etc.)
- axios: Para hacer peticiones HTTP (simuladas de inicio)
- TypeScript types: Para tipado en React Router
