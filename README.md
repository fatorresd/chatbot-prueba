# Dependencias

- react-router-dom: Para manejar rutas (Login, Dashboard, etc.)
- axios: Para hacer peticiones HTTP (simuladas de inicio)
- TypeScript types: Para tipado en React Router


# Estructura de el proyecto

login-system/
├── src/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── Navbar.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── ChatbotPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── types/
│   │   └── auth.ts
│   ├── utils/
│   │   └── mockAuth.ts
│   ├── styles/
│   │   ├── App.css
│   │   ├── LoginForm.css
│   │   ├── ChatbotPage.css
│   │   └── Navbar.css
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts