# Guía de Deploy - Sistema de Gestión de Citas Odontológicas

## 📋 Requisitos Previos

- Node.js 18+ instalado
- PostgreSQL 15+ (o servicio PostgreSQL en la nube)
- Cuenta en plataforma de hosting (Vercel recomendado para Next.js)

## 🚀 Deploy en Vercel (Frontend + API)

### 1. Preparar el Proyecto

```bash
# Verificar que el proyecto compile correctamente
npm run build

# Ejecutar tests
npm test
```

### 2. Configurar Variables de Entorno

Crear archivo `.env.production` con las siguientes variables:

```env
# Base de datos PostgreSQL (usar servicio como Railway, Neon, Supabase)
DATABASE_URL="postgresql://usuario:password@host:5432/nombre_db?schema=public"

# NextAuth (generar con: openssl rand -base64 32)
NEXTAUTH_SECRET="tu-secret-key-muy-segura-aqui"
NEXTAUTH_URL="https://tu-dominio.vercel.app"

# Configuración adicional
NODE_ENV="production"
```

### 3. Deploy en Vercel

#### Opción A: Desde Dashboard de Vercel

1. Ir a [vercel.com](https://vercel.com)
2. Click en "New Project"
3. Importar repositorio de GitHub
4. Configurar:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. Agregar variables de entorno:
   - Click en "Environment Variables"
   - Agregar todas las variables del `.env.production`

6. Click en "Deploy"

#### Opción B: Desde CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 🐘 Deploy de Base de Datos PostgreSQL

### Opción 1: Railway

1. Ir a [railway.app](https://railway.app)
2. Crear nuevo proyecto
3. Agregar PostgreSQL de plantilla
4. Copiar la `DATABASE_URL` generada
5. Ejecutar migraciones (TypeORM lo hace automáticamente con `synchronize: true`)

### Opción 2: Neon

1. Ir a [neon.tech](https://neon.tech)
2. Crear nuevo proyecto
3. Crear base de datos
4. Copiar connection string
5. Usar en variable `DATABASE_URL`

### Opción 3: Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Ir a Settings → Database
4. Copiar Connection String (mode: Session)
5. Usar en variable `DATABASE_URL`

## 📊 Seed de Datos Iniciales

Para crear el usuario admin en producción:

```bash
# Conectarse a la base de datos
# El seed se ejecuta automáticamente en el primer inicio
# Usuario: admin@consultorio.com
# Password: admin123
```

**⚠️ IMPORTANTE**: Cambiar credenciales de admin después del primer login.

## 🔒 Seguridad en Producción

### 1. Cambiar Credenciales por Defecto

Después del deploy, cambiar:
- Password del usuario admin
- `NEXTAUTH_SECRET` (generar uno nuevo)

### 2. Configurar CORS (si es necesario)

En `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://tu-dominio.com" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
        ],
      },
    ];
  },
};
```

### 3. Desactivar Sincronización Automática de DB

En `lib/db/data-source.ts`, cambiar:

```typescript
export const AppDataSource = new DataSource({
  // ...
  synchronize: false, // ⚠️ Cambiar a false en producción
  // ...
});
```

Y usar migraciones TypeORM en su lugar.

## 📈 Monitoreo y Logs

### Vercel Logs

```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver logs de producción
vercel logs --prod
```

### Acceder a Logs de Auditoría

Los logs están disponibles en: `https://tu-dominio.vercel.app/audit-logs`

## 🧪 Verificación Post-Deploy

### Checklist

- [ ] Aplicación accesible en URL de producción
- [ ] Login funcional con credenciales admin
- [ ] Base de datos conectada correctamente
- [ ] CRUD de citas funcional
- [ ] Búsqueda y filtros operativos
- [ ] Vista de calendario funcional
- [ ] Exportación PDF funcional
- [ ] Logs de auditoría registrándose
- [ ] Tests pasando: `npm test`

### Endpoints a Verificar

```bash
# Health check
curl https://tu-dominio.vercel.app/api/auth/session

# Listar citas (requiere autenticación)
curl https://tu-dominio.vercel.app/api/appointments
```

## 🔄 Actualizar Deploy

```bash
# Con Git push (si está conectado a Vercel)
git push origin main

# O con CLI
vercel --prod
```

## 🆘 Troubleshooting

### Error: Database connection failed

- Verificar que `DATABASE_URL` esté correctamente configurada
- Verificar que la base de datos esté activa
- Verificar firewall/whitelist de IPs

### Error: NextAuth session not working

- Verificar que `NEXTAUTH_SECRET` esté configurada
- Verificar que `NEXTAUTH_URL` coincida con el dominio de producción

### Error: Build failed

```bash
# Limpiar cache y rebuild
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Railway Docs](https://docs.railway.app)
- [TypeORM Migrations](https://typeorm.io/migrations)

---

## 🎉 ¡Deploy Completo!

Tu aplicación estará disponible en: `https://tu-proyecto.vercel.app`

**Credenciales iniciales:**
- Email: admin@consultorio.com
- Password: admin123

**⚠️ RECUERDA**: Cambiar estas credenciales inmediatamente después del primer login.
