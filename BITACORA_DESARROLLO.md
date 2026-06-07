# 📖 Bitácora de Desarrollo — SorpresasWonderStore

> **Proyecto:** Tienda en línea de bisutería y accesorios elegantes  
> **Cliente:** SorpresasWonderStore  
> **Versión:** 0.1.0  
> **Fecha de inicio:** Junio 2026  
> **Stack:** Next.js 16 + React 19 + TypeScript + Firebase Firestore + UploadThing

---

## 📋 Índice

1. [Resumen del Proyecto](#1-resumen-del-proyecto)
2. [Arquitectura General](#2-arquitectura-general)
3. [Estructura de Archivos](#3-estructura-de-archivos)
4. [Configuración Inicial](#4-configuración-inicial)
5. [Desarrollo del Frontend — Tienda Pública](#5-desarrollo-del-frontend--tienda-pública)
6. [Desarrollo del Frontend — Panel de Administración](#6-desarrollo-del-frontend--panel-de-administración)
7. [Desarrollo de la API (Backend)](#7-desarrollo-de-la-api-backend)
8. [Integración con Firebase Firestore](#8-integración-con-firebase-firestore)
9. [Integración con UploadThing](#9-integración-con-uploadthing)
10. [Estilos y Diseño Visual](#10-estilos-y-diseño-visual)
11. [Autenticación del Panel Admin](#11-autenticación-del-panel-admin)
12. [Integración con WhatsApp](#12-integración-con-whatsapp)
13. [Variables de Entorno](#13-variables-de-entorno)
14. [Decisiones Técnicas](#14-decisiones-técnicas)
15. [Próximos Pasos](#15-próximos-pasos)

---

## 1. Resumen del Proyecto

SorpresasWonderStore es una tienda en línea construida con **Next.js 16** y **React 19** que permite a un negocio de bisutería y accesorios:

- **Mostrar un catálogo de productos** en una tienda pública con diseño moderno y responsivo.
- **Administrar productos** (crear, editar, publicar/ocultar, eliminar) mediante un panel de administración protegido por contraseña.
- **Subir imágenes** de productos y logo de la tienda usando UploadThing.
- **Conectar con clientes** a través de WhatsApp, permitiendo consultas y pedidos directos desde cada producto.

El proyecto reemplaza el template inicial de Next.js (`create-next-app`) con una aplicación funcional completa.

---

## 2. Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 16 App                         │
│  ┌─────────────────────┐    ┌─────────────────────────┐  │
│  │   Tienda Pública     │    │   Panel Administrativo   │  │
│  │   (app/page.tsx)     │    │   (app/admin/)            │  │
│  └─────────┬───────────┘    └───────────┬─────────────┘  │
│            │                            │                │
│  ┌─────────▼───────────────────────────▼─────────────┐  │
│  │          API Routes (app/api/)                     │  │
│  │  /api/products     /api/admin/products            │  │
│  │  /api/settings     /api/uploadthing                │  │
│  └─────────┬───────────────────────────┬─────────────┘  │
│            │                            │                │
│  ┌─────────▼──────────┐  ┌─────────────▼─────────────┐  │
│  │  Firebase Firestore  │  │     UploadThing            │  │
│  │  (Base de datos)     │  │  (Almacenamiento imágenes) │  │
│  └─────────────────────┘  └───────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Flujo de datos principal

1. **Admin** crea/edita productos desde el panel → llamadas a `/api/admin/products`
2. Los datos se guardan en **Firebase Firestore** (colección `products`)
3. Las imágenes se suben a **UploadThing** y se guarda la URL en Firestore
4. La **tienda pública** consulta `/api/products` que devuelve solo productos publicados
5. Los clientes hacen clic en "Pedir por WhatsApp" → se genera un enlace con los detalles del producto

---

## 3. Estructura de Archivos

```
📁 sorpresaswonder/
├── 📄 app/
│   ├── 📄 globals.css              ← Estilos globales y temas
│   ├── 📄 layout.tsx                ← Layout raíz con metadatos SEO
│   ├── 📄 page.tsx                  ← Tienda pública (página principal)
│   │
│   ├── 📁 admin/
│   │   ├── 📄 page.tsx              ← Login del panel administrativo
│   │   └── 📁 dashboard/
│   │       └── 📄 page.tsx          ← Dashboard de administración
│   │
│   └── 📁 api/
│       ├── 📁 products/
│       │   └── 📄 route.ts          ← API pública: lista productos publicados
│       ├── 📁 admin/
│       │   └── 📁 products/
│       │       ├── 📄 route.ts      ← API admin: CRUD de productos
│       │       └── 📁 [id]/
│       │           └── 📄 route.ts  ← API admin: actualizar/eliminar por ID
│       ├── 📁 settings/
│       │   └── 📄 route.ts          ← API: gestión del logo de la tienda
│       └── 📁 uploadthing/
│           ├── 📄 core.ts           ← Configuración de endpoints UploadThing
│           └── 📄 route.ts          ← Route handler de UploadThing
│
├── 📁 lib/
│   ├── 📄 firebase.ts              ← Inicialización de Firebase
│   └── 📄 uploadthing.ts           ← Componentes React de UploadThing
│
├── 📄 next.config.ts               ← Configuración de Next.js (remotePatterns)
├── 📄 package.json                  ← Dependencias
├── 📄 tsconfig.json                 ← Configuración de TypeScript
├── 📄 BITACORA_DESARROLLO.md       ← Este archivo
└── 📄 README.md                     ← Documentación del proyecto
```

---

## 4. Configuración Inicial

### 4.1 Dependencias Instaladas

```json
{
  "dependencies": {
    "@uploadthing/react": "^7.3.3",
    "firebase": "^12.13.0",
    "firebase-admin": "^13.10.0",
    "next": "16.2.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "uploadthing": "^7.7.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

**Nota:** Aunque Tailwind CSS está instalado, se decidió usar **CSS puro con variables CSS** para tener control total sobre el diseño, aprovechando la paleta de colores y el tema visual específico del cliente.

### 4.2 Configuración de Next.js

En `next.config.ts` se configuraron los `remotePatterns` para permitir la carga de imágenes desde UploadThing:

```typescript
images: {
  remotePatterns: [
    { protocol: "https", hostname: "utfs.io" },
    { protocol: "https", hostname: "*.ufs.sh" },
    { protocol: "https", hostname: "uploadthing.com" },
  ],
}
```

Esto es necesario porque Next.js optimiza las imágenes mediante `<Image>` y requiere autorizar explícitamente los dominios externos.

---

## 5. Desarrollo del Frontend — Tienda Pública

**Archivo:** `app/page.tsx`

### 5.1 Componentes Principales

| Componente | Descripción |
|---|---|
| `StorePage` | Componente principal que orquesta toda la tienda |
| `ProductCard` | Tarjeta individual de cada producto con imagen, nombre, precio y botón WhatsApp |
| `ProductModal` | Modal con detalles ampliados del producto |
| `WhatsAppIcon` | Icono SVG de WhatsApp reutilizable |

### 5.2 Funcionalidades Implementadas

#### Navbar (Barra de navegación)
- **Sticky** — permanece fija al hacer scroll
- **Fondo translúcido** con efecto glassmorphism (`backdrop-filter: blur(20px)`)
- **Logo dinámico** — muestra el logo subido desde el admin, o un placeholder "W" si no hay logo
- **Botón "Contactar"** — enlace directo a WhatsApp

#### Hero Section
- Título principal: "Elegancia en cada detalle"
- Subtítulo con la propuesta de valor
- Fondo con degradado suave

#### Catálogo de Productos
- Grid responsivo (auto-fill, min 280px por columna)
- **Estados cubiertos:**
  - **Loading:** Spinner animado mientras se cargan los productos
  - **Empty:** Mensaje "Próximamente" con emoji 🛍️ cuando no hay productos
  - **Productos:** Grid de tarjetas interactivas
- Cada tarjeta muestra: imagen, referencia, nombre, descripción (máx 2 líneas), precio y botón "Pedir"

#### Modal de Producto
- Se abre al hacer clic en la imagen o nombre del producto
- Muestra imagen en tamaño completo, referencia, nombre, precio, descripción completa
- Botón "Pedir por WhatsApp" con el contexto del producto precargado

#### WhatsApp FAB (Floating Action Button)
- Botón flotante verde de WhatsApp en la esquina inferior derecha
- Animación de pulso para llamar la atención
- Enlace directo a WhatsApp con mensaje genérico

#### Footer
- Nombre de la marca, año actual, ubicación (Caracas, Venezuela)
- Divisor decorativo

### 5.3 Fetch de Datos (Frontend)

```typescript
useEffect(() => {
  async function load() {
    const [pRes, sRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/settings"),
    ]);
    // Procesar y asignar estado
  }
  load();
}, []);
```

Se usan `Promise.all` para cargar productos y configuración en paralelo, minimizando el tiempo de carga.

---

## 6. Desarrollo del Frontend — Panel de Administración

### 6.1 Login (`app/admin/page.tsx`)

**Componente:** `AdminLoginPage`

- Formulario simple de contraseña
- Autenticación del lado del cliente usando `sessionStorage`
- Contraseña: `Wifi202.` (almacenada en base64)
- Estados: idle, loading (con spinner), error (mensaje de error)
- Redirección a `/admin/dashboard` tras autenticación exitosa

### 6.2 Dashboard (`app/admin/dashboard/page.tsx`)

Este es el componente más complejo de la aplicación. Está dividido en varios subcomponentes:

#### Subcomponentes

| Componente | Propósito |
|---|---|
| `AdminDashboardPage` | Componente principal que orquesta todo el dashboard |
| `ProductForm` | Formulario para crear nuevos productos |
| `EditProductModal` | Modal para editar productos existentes |
| `ProductsTable` | Tabla que lista todos los productos con acciones |
| `LogoSection` | Sección para subir/actualizar el logo de la tienda |
| `useToast` | Hook personalizado para notificaciones toast |
| Iconos SVG | `IconTrash`, `IconEye`, `IconEdit` (componentes inline) |

#### Funcionalidades

**Protección de ruta:**
```typescript
useEffect(() => {
  const session = sessionStorage.getItem("sw_admin");
  if (!session || atob(session) !== "Wifi202.") {
    router.replace("/admin");
  }
}, [router]);
```

**Estadísticas:** Barra superior con conteo de: Total de Productos, Publicados, Borradores.

**Tabs de gestión:**
- **"Nuevo Producto"** — formulario completo para crear productos
- **"Logo Tienda"** — sección para subir logo

**Subida de imágenes con preview:**
- Muestra miniaturas de las imágenes subidas
- Cada miniatura tiene botón "×" para eliminar
- Soporta subida múltiple (hasta 10 imágenes por lote)

**Formulario de producto:**
- Campos: nombre, código, precio (USD), descripción
- Validación de campos requeridos
- Envío de múltiples productos si se subieron varias imágenes
- Estados: saving (con spinner), error toast

**Tabla de productos:**
- Columnas: Imagen, Producto, Código, Precio, Estado, Acciones
- Badges de estado: "● Publicado" (verde) / "○ Borrador" (gris)
- Acciones por producto: Publicar/Ocultar, Editar (modal), Eliminar (con confirmación)
- Efecto hover en filas
- Estado empty: "Sin productos aún" con emoji 📦

**Modal de edición:** Formulario precargado con datos del producto existente.

**Toast notifications:** Sistema de notificaciones temporales (3s) con variantes: success (verde), error (rojo), default (gris oscuro).

**Logout:** Limpia `sessionStorage` y redirige al login.

---

## 7. Desarrollo de la API (Backend)

### 7.1 API Pública de Productos
**Ruta:** `GET /api/products`

```typescript
// Solo devuelve productos publicados, ordenados por fecha descendente
query(productsRef, where("published", "==", true), orderBy("createdAt", "desc"));
```

### 7.2 API Admin de Productos
**Ruta:** `GET /api/admin/products`

```typescript
// Devuelve TODOS los productos (públicos y borradores)
query(productsRef, orderBy("createdAt", "desc"));
```

**Ruta:** `POST /api/admin/products`
- Crea un nuevo producto en Firestore
- Valida campos requeridos: name, price, productCode, imageUrl
- Guarda con `published: false` por defecto
- Usa `serverTimestamp()` para la fecha de creación

### 7.3 API Admin por ID
**Ruta:** `PUT /api/admin/products/[id]`
- Actualiza cualquier campo del producto
- Se usa tanto para toggle de publicación como para edición

**Ruta:** `DELETE /api/admin/products/[id]`
- Elimina el producto de Firestore
- También elimina la imagen asociada de UploadThing mediante `UTApi.deleteFiles()`
- Verifica que el producto existe antes de eliminar

### 7.4 API de Settings
**Ruta:** `GET /api/settings`
- Obtiene la configuración de la tienda (actualmente solo el logo)

**Ruta:** `POST /api/settings`
- Actualiza el logo de la tienda
- Elimina el logo anterior de UploadThing si existe (para no acumular archivos huérfanos)

---

## 8. Integración con Firebase Firestore

### 8.1 Inicialización

**Archivo:** `lib/firebase.ts`

Se inicializa Firebase con dos instancias de Firestore:
- `db` — Firestore completa (no se usa actualmente, pero disponible para futuras necesidades como listeners en tiempo real)
- `dbLite` — Firestore Lite (más liviana, usada para todas las operaciones actuales)

### 8.2 Colección: `products`

Estructura de cada documento:

```typescript
interface Product {
  id: string;        // ID generado por Firestore
  name: string;      // Nombre del producto
  description: string; // Descripción (puede ser vacía)
  price: number;     // Precio en USD
  productCode: string; // Código de referencia (ej. "COL-001")
  imageUrl: string;  // URL de la imagen en UploadThing
  imageKey: string;  // Key para eliminar la imagen de UploadThing
  published: boolean; // Estado de publicación
  createdAt: Timestamp; // Fecha de creación (serverTimestamp)
}
```

### 8.3 Colección: `settings`

Documento único con ID `store`:

```typescript
interface Settings {
  logoUrl?: string;  // URL del logo en UploadThing
  logoKey?: string;  // Key para eliminar el logo de UploadThing
}
```

### 8.4 Manejo de Errores

Todas las rutas API tienen bloques try-catch que:
1. Capturan el error
2. Lo registran en consola
3. Devuelven un Response con código 500 y mensaje de error

---

## 9. Integración con UploadThing

### 9.1 Configuración de Endpoints

**Archivo:** `app/api/uploadthing/core.ts`

Se definieron dos endpoints de subida:

| Endpoint | Tipo | Max Size | Max Count | Propósito |
|---|---|---|---|---|
| `productImage` | image | 8MB | 10 | Imágenes de productos |
| `logoImage` | image | 4MB | 1 | Logo de la tienda |

### 9.2 Route Handler

**Archivo:** `app/api/uploadthing/route.ts`

Se creó el route handler estándar de UploadThing para Next.js App Router, exportando `GET` y `POST`.

### 9.3 Componentes React

**Archivo:** `lib/uploadthing.ts`

```typescript
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
```

### 9.4 Eliminación de Imágenes

Cuando se elimina un producto o se actualiza el logo:
```typescript
const utapi = new UTApi();
await utapi.deleteFiles(imageKey);
```

Esto evita acumular archivos huérfanos en UploadThing.

---

## 10. Estilos y Diseño Visual

### 10.1 Filosofía de Diseño

- **Inspiración Apple:** Limpio, minimalista, tipográfico
- **Paleta monocromática:** Blancos, grises y negro
- **Sin Tailwind:** Se usó CSS puro con variables para control total

### 10.2 Sistema de Variables CSS

```css
:root {
  --white: #ffffff;
  --off-white: #f5f5f7;
  --light-gray: #e8e8ed;
  --gray: #86868b;
  --dark-gray: #1d1d1f;
  --black: #000000;
  
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  
  --shadow-xs: 0 1px 3px rgba(0,0,0,.06);
  --shadow-sm: 0 2px 8px rgba(0,0,0,.08);
  --shadow-md: 0 8px 24px rgba(0,0,0,.10);
  --shadow-lg: 0 20px 48px rgba(0,0,0,.14);
  
  --transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 10.3 Componentes CSS Clave

| Selector | Descripción |
|---|---|
| `.navbar` | Navbar sticky con glassmorphism |
| `.hero` | Sección hero con degradado |
| `.product-grid` | Grid responsivo para tarjetas |
| `.product-card` | Tarjeta con hover elevación y sombra |
| `.btn` | Sistema de botones con variantes |
| `.whatsapp-fab` | Botón flotante con animación pulso |
| `.admin-content` | Layout de 2 columnas para el dashboard |
| `.product-table` | Tabla estilizada para productos |
| `.modal-overlay` | Overlay con blur para modales |
| `.toast-container` | Contenedor para notificaciones |
| `.tabs` | Tabs estilizados para gestión |

### 10.4 Animaciones

- **Card hover:** Elevación + sombra + escala de imagen
- **WhatsApp FAB:** Animación de pulso infinita
- **Toast:** Animación de entrada desde abajo
- **Modal:** Animación de entrada
- **Spinner:** Rotación continua

### 10.5 Responsive Design

- **Tablets (< 900px):** Dashboard cambia a 1 columna
- **Móviles (< 600px):** Ajustes de padding, fuente, grid 2 columnas
- **Móviles pequeños (< 400px):** Grid 1 columna

---

## 11. Autenticación del Panel Admin

### 11.1 Sistema de Autenticación

Se implementó un sistema de autenticación **simple del lado del cliente** usando `sessionStorage`:

1. El usuario ingresa la contraseña en `/admin`
2. Se compara con la contraseña hardcodeada `Wifi202.`
3. Si es correcta, se guarda en `sessionStorage` codificada en base64
4. Se redirige a `/admin/dashboard`
5. El dashboard verifica la sesión; si no es válida, redirige al login

### 11.2 Limitaciones y Seguridad

> ⚠️ **Nota importante:** Este es un sistema de autenticación básico y **no es seguro para producción real**. La contraseña está hardcodeada en el código fuente. Para un entorno de producción, se recomienda:
> - Usar Firebase Authentication, NextAuth.js, o un proveedor OAuth
> - Implementar autenticación del lado del servidor
> - Usar HTTPS y cookies httpOnly

---

## 12. Integración con WhatsApp

### 12.1 Número de WhatsApp

```typescript
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "584126713437";
```

### 12.2 Generación de Enlaces

Se usa la [WhatsApp Click to Chat API](https://faq.whatsapp.com/5913398998672934):

```
https://wa.me/{numero}?text={mensaje_codificado}
```

### 12.3 Mensajes Predefinidos

**Por producto (desde la tarjeta o modal):**
```
Hola! Estoy interesado/a en el producto:

*{nombre}*
Código: {código}
Precio: ${precio}

¿Está disponible?
```

**General (desde el FAB o botón "Contactar"):**
```
Hola! Quisiera obtener más información sobre sus productos. 😊
```

---

## 13. Variables de Entorno

El proyecto requiere las siguientes variables de entorno:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# UploadThing
UPLOADTHING_TOKEN=

# WhatsApp (opcional, por defecto usa 584126713437)
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

---

## 14. Decisiones Técnicas

### 14.1 ¿Por qué CSS puro y no Tailwind?

Tailwind CSS está instalado como dependencia, pero se optó por CSS puro con variables. Razones:
- Control total sobre cada detalle de estilo
- Tema visual consistente con variables CSS
- Sin clases utilitarias extensas en el HTML
- Más fácil de mantener para un proyecto pequeño

### 14.2 ¿Por qué Firestore Lite?

Se importó Firestore Lite (`firebase/firestore/lite`) para las operaciones CRUD porque:
- Es más liviano (no incluye listeners en tiempo real)
- Para un catálogo de productos, no se necesitan actualizaciones en tiempo real
- Reduce el tamaño del bundle

### 14.3 ¿Por qué `sessionStorage` y no cookies?

- Simplicidad de implementación
- No requiere configuración de backend adicional
- La sesión se limpia al cerrar la pestaña (comportamiento deseado)
- La autenticación es básica — no hay tokens JWT ni sesiones persistentes

### 14.4 ¿Por qué UploadThing y no Firebase Storage?

- UploadThing se integra nativamente con Next.js App Router
- Maneja automáticamente la optimización de imágenes
- No requiere configuraciones adicionales de CORS
- SDK liviano con componentes React listos para usar

### 14.5 Manejo de Errores en el Frontend

- **API calls:** try-catch + logging a consola
- **Formularios:** Validación de campos requeridos + mensajes toast
- **Imágenes:** Validación de tamaño y tipo mediante UploadThing
- **Estados:** Loading, empty, error cubiertos en todos los componentes

---

## 15. Próximos Pasos (Recomendaciones)

### Funcionalidades Pendientes

1. **Autenticación segura:** Implementar Firebase Authentication o NextAuth.js
2. **Múltiples imágenes por producto:** En lugar de crear un producto por imagen
3. **Categorías y filtros:** Organizar productos por categorías
4. **Buscador:** Campo de búsqueda en la tienda
5. **SEO adicional:** Sitemap, metadata dinámica por producto
6. **Analytics:** Integrar Google Analytics o similar
7. **Modo oscuro:** Alternativa visual para usuarios nocturnos
8. **Paginación:** Para catálogos grandes (+100 productos)
9. **Caché:** Implementar SWR o React Query para mejor performance
10. **Testing:** Agregar tests unitarios y de integración

### Mejoras Técnicas

- Migrar a autenticación server-side con Next.js Middleware
- Agregar rate limiting a las API routes
- Implementar ISR (Incremental Static Regeneration) para la página pública
- Agregar PWA (manifest, service worker) para experiencia mobile mejorada

---

> **Última actualización:** Junio 2026  
> **Desarrollado con:** Codebuff AI + Next.js 16 + React 19  
> **© 2026 SorpresasWonderStore. Todos los derechos reservados.**
