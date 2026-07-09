# 🪵 Leños Rellenos

Aplicación web para negocio familiar de comida artesanal. Permite consultar el menú, agregar productos al carrito y confirmar pedidos vía WhatsApp.

## Estructura del proyecto

```
madera_system/
├── backend/     ← NestJS API REST
├── frontend/    ← React SPA (Vite + TypeScript)
├── .gitignore
└── README.md
```

## Arrancar el backend

```bash
cd backend
npm install
npm run start:dev
# → http://localhost:3000
```

## Arrancar el frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## Variables de entorno

Cada subcarpeta tiene su propio `.env.example`. Copia y ajusta:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
