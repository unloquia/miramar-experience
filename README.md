# 🌊 Miramar Experience

Plataforma turística para la ciudad de Miramar con sistema de publicidad jerarquizado.

## 🚀 Quick Start

### 1. Configura Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el SQL en `supabase/schema.sql` para crear la tabla `ads`
3. Crea un bucket de Storage llamado `ads-images` (público)
4. Copia las credenciales

### 2. Variables de Entorno

Crea un archivo `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 3. Instalar y Correr

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx              # Landing page pública
│   ├── login/                # Página de login
│   └── admin/                # Panel de administración (protegido)
│       ├── page.tsx          # Dashboard
│       └── ads/              # CRUD de anuncios
├── components/
│   ├── landing/              # Componentes de landing (Hero, BentoGrid, etc.)
│   ├── admin/                # Componentes de admin (Form, Table, etc.)
│   └── ui/                   # Componentes Shadcn
├── lib/
│   ├── supabase/             # Clientes de Supabase
│   ├── actions/              # Server Actions (CRUD)
│   ├── data/                 # Funciones de fetching
│   └── schemas.ts            # Validación Zod
└── types/
    └── database.ts           # Tipos TypeScript
```

## 🎨 Sistema de Tiers

| Tier | Ubicación | Descripción |
|------|-----------|-------------|
| **Hero** | Carrusel principal | 100% width, máxima visibilidad |
| **Featured** | Bento Grid (grande) | col-span-2, posición premium |
| **Standard** | Bento Grid (normal) | col-span-1, tarjeta estándar |

## 🔐 Autenticación

- El panel `/admin` está protegido por middleware
- Usa Supabase Auth (email/password)
- Crea un usuario en Supabase Dashboard > Authentication

## 🛠️ Stack Tecnológico

- **Next.js 15** (App Router)
- **Supabase** (PostgreSQL, Auth, Storage)
- **Tailwind CSS v4**
- **Shadcn/UI**
- **Embla Carousel**
- **Zod** (validación)

## 📝 Comandos Útiles

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run start    # Producción
npm run lint     # Linter
```

---

Desarrollado para Miramar Experience 🏖️
