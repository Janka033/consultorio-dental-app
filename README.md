# Consultorio Dental - Sistema de Gestión de Citas

Aplicación web monolítica desarrollada en Next.js para la gestión completa de citas de un consultorio odontológico. Incluye landing page informativa y sistema privado de administración para el odontólogo.

## Características

### Landing Page Pública
- **Hero Section**: Propuesta de valor clara y llamativa
- **Servicios**: 6 servicios odontológicos detallados
- **Horarios de Atención**: Información clara de disponibilidad
- **Información del Odontólogo**: Perfil profesional completo
- **Sección de Contacto**: WhatsApp, email y dirección física
- **Diseño Responsive**: Optimizado para todos los dispositivos

### Sistema de Gestión (Dashboard)
- **Autenticación Segura**: Implementada con NextAuth.js
- **CRUD Completo de Citas**: Crear, leer, actualizar y eliminar
- **Búsqueda por Paciente**: Filtro dinámico en tiempo real
- **Filtro por Fecha**: Visualización de citas específicas
- **Validaciones de Negocio**:
  - No permite citas en el pasado
  - Previene solapamiento de horarios
  - Duración fija de 60 minutos por cita
- **Estados de Citas**: Agendada, Cancelada, Finalizada

## Tecnologías Utilizadas

- **Frontend**: Next.js 16+ con App Router, TypeScript, TailwindCSS
- **Backend**: API Routes de Next.js
- **Base de Datos**: PostgreSQL 15 con TypeORM
- **Autenticación**: NextAuth.js v5
- **Validaciones**: Zod
- **Containerización**: Docker & Docker Compose
- **UI Components**: Radix UI + shadcn/ui

## Instalación y Configuración

### Requisitos Previos
- Node.js 18+ 
- Docker y Docker Compose
- npm o yarn

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/Janka033/consultorio-dental-app.git
cd consultorio-dental-app
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=dental_user
DB_PASSWORD=dental_pass_2026
DB_DATABASE=dental_db

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-clave-secreta-muy-larga-y-segura-cambiar-en-produccion

# Node Environment
NODE_ENV=development
```

### Paso 4: Iniciar PostgreSQL con Docker
```bash
docker-compose up -d
```

Esto iniciará un contenedor de PostgreSQL en el puerto 5432.

### Paso 5: Ejecutar el proyecto
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Credenciales de Prueba

Para acceder al dashboard:
- **Email**: `admin@consultorio.com`
- **Password**: `admin123`

**Nota**: Estas credenciales se crean automáticamente al iniciar la aplicación por primera vez gracias al seeder.

## Endpoints de la API

### Appointments (Citas)

#### `GET /api/appointments`
Lista todas las citas con filtros opcionales.

**Query Parameters:**
- `date` (opcional): Filtrar por fecha (formato YYYY-MM-DD)
- `patientName` (opcional): Buscar por nombre de paciente

**Respuestas:**
- `200 OK`: Lista de citas
- `500 Internal Server Error`: Error del servidor

**Ejemplo:**
```bash
GET /api/appointments?date=2026-01-15
GET /api/appointments?patientName=Juan
```

#### `POST /api/appointments`
Crea una nueva cita.

**Body:**
```json
{
  "patientName": "Juan Pérez",
  "date": "2026-01-15",
  "time": "10:00",
  "notes": "Primera consulta",
  "status": "agendada"
}
```

**Respuestas:**
- `201 Created`: Cita creada exitosamente
- `400 Bad Request`: Datos inválidos o cita en el pasado
- `409 Conflict`: Conflicto de horario (solapamiento)
- `500 Internal Server Error`: Error del servidor

#### `GET /api/appointments/:id`
Obtiene una cita específica por ID.

**Respuestas:**
- `200 OK`: Datos de la cita
- `404 Not Found`: Cita no encontrada
- `500 Internal Server Error`: Error del servidor

#### `PUT /api/appointments/:id`
Actualiza una cita existente.

**Body:** Igual que POST

**Respuestas:**
- `200 OK`: Cita actualizada
- `400 Bad Request`: Datos inválidos
- `404 Not Found`: Cita no encontrada
- `409 Conflict`: Conflicto de horario
- `500 Internal Server Error`: Error del servidor

#### `DELETE /api/appointments/:id`
Elimina una cita.

**Respuestas:**
- `200 OK`: Cita eliminada
- `404 Not Found`: Cita no encontrada
- `500 Internal Server Error`: Error del servidor

## Estructura del Proyecto

```
consultorio-dental-app/
├── app/
│   ├── api/
│   │   ├── appointments/
│   │   │   ├── route.ts          # GET, POST
│   │   │   └── [id]/route.ts     # GET, PUT, DELETE
│   │   └── auth/
│   │       └── [...nextauth]/route.ts
│   ├── dashboard/
│   │   └── page.tsx               # Dashboard principal
│   ├── login/
│   │   └── page.tsx               # Página de login
│   ├── layout.tsx
│   └── page.tsx                   # Landing page
├── components/
│   ├── dashboard/
│   │   ├── AppointmentList.tsx
│   │   └── AppointmentModal.tsx
│   ├── landing/
│   │   └── Hero.tsx
│   ├── providers/
│   │   └── SessionProvider.tsx
│   └── ui/                        # Componentes de shadcn/ui
├── lib/
│   ├── db/
│   │   ├── data-source.ts         # Configuración TypeORM
│   │   ├── seed.ts                # Datos iniciales
│   │   └── entities/
│   │       ├── Appointment.ts
│   │       └── User.ts
│   ├── validations/
│   │   └── appointment.ts         # Esquemas Zod
│   ├── auth.ts                    # Configuración NextAuth
│   └── utils.ts
├── docker-compose.yml
├── package.json
└── README.md
```

## Reglas de Negocio Implementadas

1. **No citas en el pasado**: El sistema valida que la fecha y hora de la cita sean futuras.
2. **Sin solapamiento**: Cada cita tiene duración de 60 minutos. El sistema previene conflictos de horario.
3. **Estados de citas**: 
   - `agendada`: Cita programada
   - `cancelada`: Cita cancelada
   - `finalizada`: Cita completada
4. **Autenticación requerida**: Solo el odontólogo autenticado puede acceder al dashboard.
5. **Validación de datos**: Todos los campos son validados en backend con Zod.

## Decisiones Técnicas

### ¿Por qué Next.js con App Router?
- Renderizado híbrido (SSR + CSR)
- API Routes integradas
- Optimización automática
- File-based routing

### ¿Por qué TypeORM + PostgreSQL?
- ORM maduro y bien documentado
- Soporte completo para TypeScript
- Migraciones automáticas
- PostgreSQL es robusto y escalable

### ¿Por qué Docker?
- Entorno consistente entre desarrollo y producción
- Fácil configuración de PostgreSQL
- Portabilidad del proyecto

### ¿Por qué NextAuth?
- Integración nativa con Next.js
- Manejo seguro de sesiones con JWT
- Soporte para múltiples providers
- Ampliamente usado en la industria

## Valor Agregado Implementado

✅ **Búsqueda por paciente**: Filtro dinámico en tiempo real  
✅ **Filtro por fecha**: Visualización de citas por día  
✅ **Docker**: Entorno containerizado  
✅ **Validaciones robustas**: Zod + validaciones de negocio  
✅ **UI profesional**: shadcn/ui + TailwindCSS  
✅ **Landing page completa**: 6 secciones informativas  

## Scripts Disponibles

```bash
npm run dev          # Modo desarrollo
npm run build        # Build de producción
npm run start        # Iniciar producción
npm run lint         # Ejecutar ESLint
```

## Docker Commands

```bash
# Iniciar contenedores
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener contenedores
docker-compose down

# Reiniciar contenedores
docker-compose restart
```

## Mejoras Futuras / Pendientes

- [ ] Implementar tests unitarios e integración (Jest + Testing Library)
- [ ] Vista de calendario visual
- [ ] Exportar citas a PDF/Excel
- [ ] Notificaciones por email/SMS
- [ ] Historial de cambios (logs de auditoría)
- [ ] Dashboard de estadísticas
- [ ] Deploy en Vercel + Railway/Supabase
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)

## Contribución

Este proyecto fue desarrollado como prueba técnica. Para consultas o sugerencias, contactar a [santiagojl@parzik.com](mailto:santiagojl@parzik.com)

## Licencia

Este proyecto es de uso educativo y publico.

---

**Desarrollado con Amor usando Next.js, TypeScript y TypeORM**
