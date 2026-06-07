# SorpresasWonderStore 💎

**Bisutería & Accesorios Elegantes** — Tienda en línea construida con Next.js 16, React 19, Firebase Firestore y UploadThing.

## ✨ Características

- 🏪 **Tienda pública** con catálogo de productos, diseño elegante y responsivo
- 📱 **Integración con WhatsApp** para consultas y pedidos directos desde cada producto
- 🔐 **Panel de administración** protegido con autenticación por contraseña
- 📦 **Gestión de productos**: crear, editar, publicar/ocultar y eliminar
- 🖼️ **Subida de imágenes** con UploadThing (productos y logo de tienda)
- 🔥 **Base de datos** Firebase Firestore para persistencia de datos
- ✨ **Animaciones** con scroll reveal, transiciones suaves y micro-interacciones
- 🌙 **Diseño responsivo** optimizado para móviles, tablets y escritorio

## 🛠️ Stack Tecnológico

| Tecnología | Propósito |
|---|---|
| Next.js 16 | Framework React con App Router |
| React 19 | UI y componentes interactivos |
| TypeScript | Tipado estático |
| Firebase Firestore | Base de datos NoSQL |
| UploadThing | Almacenamiento y optimización de imágenes |
| CSS Puro | Sistema de diseño con variables CSS |

## 🚀 Inicio Rápido

```bash
# 1. Clonar el repositorio
git clone https://github.com/sorpresaswonderstore-crypto/sorpresaswonder.git
cd sorpresaswonder

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crea un archivo .env.local con:
#   NEXT_PUBLIC_FIREBASE_API_KEY=
#   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
#   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
#   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
#   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
#   NEXT_PUBLIC_FIREBASE_APP_ID=
#   UPLOADTHING_TOKEN=
#   NEXT_PUBLIC_WHATSAPP_NUMBER=

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Abrir http://localhost:3000
```

## 📁 Estructura del Proyecto

```
sorpresaswonder/
├── app/
│   ├── globals.css          # Sistema de diseño global
│   ├── layout.tsx           # Layout raíz con metadatos SEO
│   ├── page.tsx             # Tienda pública (página principal)
│   ├── admin/
│   │   ├── page.tsx         # Login del panel administrativo
│   │   └── dashboard/
│   │       └── page.tsx     # Dashboard de administración
│   └── api/
│       ├── products/        # API pública de productos
│       ├── admin/products/  # API CRUD de productos (admin)
│       ├── settings/        # API de configuración (logo)
│       └── uploadthing/     # Configuración UploadThing
├── lib/
│   ├── firebase.ts          # Inicialización de Firebase
│   └── uploadthing.ts       # Componentes React UploadThing
├── next.config.ts
├── package.json
└── BITACORA_DESARROLLO.md   # Bitácora detallada del desarrollo
```

## 🔑 Acceso al Panel Admin

1. Ve a `/admin` en tu sitio
2. Ingresa la contraseña configurada
3. Administra productos, imágenes y el logo de la tienda

## 📱 Integración WhatsApp

Cada producto tiene un botón "Pedir por WhatsApp" que abre un chat predefinido con la información del producto. También hay un botón flotante de WhatsApp para consultas generales.

## 🇻🇪 Hecho en Venezuela

Desarrollado con 💛 para SorpresasWonderStore — Caracas, Venezuela.
