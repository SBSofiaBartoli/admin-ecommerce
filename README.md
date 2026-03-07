# 🛍️ SmartStyle Admin — Ecommerce Dashboard

Panel de administración **Full Stack** para gestionar un ecommerce completo: productos, categorías, clientes y ventas.

Este proyecto fue desarrollado como **prueba técnica**, implementando una arquitectura separada **Backend (API REST)** y **Frontend (Dashboard)** con autenticación, subida de imágenes y gestión avanzada de productos.

---

# 🚀 Demo de funcionalidades

El panel permite administrar:

### 📦 Productos
- CRUD completo  
- Opciones y variantes automáticas  
- Subida de imágenes con Cloudinary  
- Filtros por categoría y búsqueda  

### 🗂️ Categorías
- Sistema jerárquico **padre → hijo**  
- Expansión de subcategorías  
- Edición y eliminación con confirmación  

### 🛒 Ventas
- Generación de ventas demo  
- Cambio de estado de pedidos  
- Historial de modificaciones  

### 👥 Clientes
- Listado de clientes  
- Historial completo de compras  
- Total gastado  

### 👤 Perfil de usuario
- Avatar editable  
- Almacenado en Cloudinary  
- Persistencia entre sesiones  

---

# 🧰 Tecnologías utilizadas

## Backend

- **NestJS 11** — framework Node modular  
- **Prisma 7** — ORM moderno para PostgreSQL  
- **PostgreSQL** — base de datos relacional  
- **JWT + Passport** — autenticación segura  
- **Cloudinary** — almacenamiento de imágenes  
- **Multer** — manejo de archivos  
- **class-validator / class-transformer** — validación de DTOs  

## Frontend

- **Next.js 16 (App Router)** — SSR y routing moderno  
- **React 19**  
- **Tailwind CSS v4**  
- **Shadcn UI** — componentes accesibles  
- **Sonner** — notificaciones toast  
- **Lucide React** — iconos  

---

# 🏗️ Arquitectura del proyecto
admin-ecommerce/
├── apps/
│ ├── backend/
│ │ ├── prisma/
│ │ │ ├── schema.prisma
│ │ │ ├── seed.ts
│ │ │ └── migrations/
│ │ ├── src/
│ │ │ ├── common/
│ │ │ │ ├── cloudinary/
│ │ │ │ └── guards/
│ │ │ ├── modules/
│ │ │ │ ├── auth/
│ │ │ │ ├── categories/
│ │ │ │ ├── customers/
│ │ │ │ ├── products/
│ │ │ │ │ └── dto/
│ │ │ │ ├── profile/
│ │ │ │ └── sales/
│ │ │ ├── prisma/
│ │ │ ├── app.module.ts
│ │ │ └── main.ts
│ │ └── test/
│ │
│ └── frontend/
│ └── src/
│ ├── api/
│ ├── app/
│ │ ├── auth/login/
│ │ └── dashboard/
│ │ ├── categories/
│ │ ├── coming-soon/
│ │ ├── customers/
│ │ ├── products/
│ │ │ └── new/
│ │ └── sales/
│ ├── components/
│ │ ├── layout/
│ │ ├── shared/
│ │ └── ui/
│ ├── hooks/
│ ├── lib/
│ └── types/
│
├── .env.example
├── .gitignore
└── README.md

---

# 🗄️ Modelos de base de datos

| Modelo | Descripción |
|------|------|
| User | Administrador con email, password hasheado y avatar |
| Category | Categorías con relación padre/hijo |
| Product | Producto con variantes y opciones |
| ProductOption | Opciones del producto (ej: color) |
| ProductOptionValue | Valores de opción (ej: rojo, azul) |
| ProductVariant | Combinación de valores con stock |
| ProductImage | Imágenes en Cloudinary |
| Customer | Clientes del ecommerce |
| Sale | Venta realizada |
| SaleItem | Ítems de una venta |
| SaleHistory | Historial de estado |
| Shipment | Información de envío |

---

# 🔗 API Endpoints principales

## Auth

| Método | Ruta | Descripción |
|------|------|------|
| POST | /auth/login | Login con email y password |

---

## Categories

| Método | Ruta | Descripción |
|------|------|------|
| GET | /categories | Listar todas las categorías |
| GET | /categories/:id/children | Obtener subcategorías |
| POST | /categories | Crear categoría |
| PUT | /categories/:id | Editar categoría |
| DELETE | /categories/:id | Eliminar categoría |

---

## Products

| Método | Ruta | Descripción |
|------|------|------|
| GET | /products | Listar productos |
| GET | /products/:id | Detalle de producto |
| POST | /products | Crear producto |
| PUT | /products/:id | Editar producto |
| PUT | /products/:id/variants | Reemplazar variantes |
| POST | /products/:id/images | Subir imágenes |
| DELETE | /products/:id | Eliminar producto |

---

## Customers

| Método | Ruta | Descripción |
|------|------|------|
| GET | /customers | Listar clientes |
| GET | /customers/:id | Detalle cliente |

---

## Sales

| Método | Ruta | Descripción |
|------|------|------|
| GET | /sales | Listar ventas |
| POST | /sales | Generar venta demo |
| PUT | /sales/:id/status | Cambiar estado |

---

# 🔑 Credenciales de prueba

Generadas automáticamente por el seed:
Email: admin@admin.com
Password: admin123

---

# ⚙️ Instalación

## 1️⃣ Clonar repositorio

```bash
git clone https://github.com/tu-usuario/admin-ecommerce.git
cd admin-ecommerce

2️⃣ Instalar dependencias
Backend
cd apps/backend
npm install

Frontend
cd apps/frontend
npm install

3️⃣ Configurar variables de entorno
Backend
Archivo:
apps/backend/.env
Variables:
DATABASE_URL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

Frontend
Archivo:
apps/frontend/.env.local
Variable:
NEXT_PUBLIC_API_URL=http://localhost:3000

4️⃣ Migraciones
cd apps/backend

npx prisma migrate dev
npx prisma db seed

5️⃣ Ejecutar proyecto
Backend
npm run start:dev

Frontend
npm run dev

📌 Características técnicas destacadas

Arquitectura modular con NestJS

ORM Prisma con relaciones complejas

Sistema de variantes de productos

Subida de imágenes con Cloudinary

JWT stateless authentication

Frontend SSR con Next.js

UI accesible con shadcn

💡 Este proyecto fue desarrollado como prueba técnica para evaluar habilidades Full Stack, incluyendo arquitectura, modelado de datos y experiencia de usuario.
