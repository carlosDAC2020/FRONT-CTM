# 📘 Guía de Configuración - FINCOR Frontend

Esta guía explica cómo configurar y usar la aplicación Angular para conectarse con la API-CTM.

## 🔧 Configuración de la URL Base de la API

### Opción 1: Archivos de Entorno (Recomendado)

La URL base de la API se configura en los archivos de entorno ubicados en `src/environments/`:

#### Para Desarrollo (`environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000'  // ← Modifica esta URL
};
```

#### Para Producción (`environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-api-produccion.com'  // ← Modifica esta URL
};
```

### Opción 2: Variables de Entorno del Sistema

Para usar variables de entorno del sistema durante el build, puedes crear un script personalizado o usar herramientas como `dotenv`.

**Ejemplo con archivo `.env` en la raíz:**
```env
API_URL=http://localhost:8000
```

Luego modificar `environment.ts` para leer esta variable (requiere configuración adicional).

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn
- Angular CLI (v20 o superior)

### Pasos de Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar la URL de la API:**
   - Edita `src/environments/environment.ts` con la URL de tu backend

3. **Ejecutar en modo desarrollo:**
```bash
npm start
# o
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

4. **Compilar para producción:**
```bash
npm run build
# o
ng build --configuration production
```

Los archivos compilados estarán en `dist/`

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                      # Servicios y utilidades core
│   │   ├── guards/                # Guards de autenticación
│   │   ├── interceptors/          # Interceptores HTTP
│   │   ├── models/                # Interfaces y tipos TypeScript
│   │   └── services/              # Servicios de API
│   │       ├── auth.service.ts    # Autenticación y JWT
│   │       ├── project.service.ts # Gestión de proyectos
│   │       ├── research.service.ts# Investigaciones
│   │       └── note.service.ts    # Notas
│   │
│   ├── features/                  # Módulos de funcionalidades
│   │   ├── auth/                  # Login y Registro
│   │   ├── dashboard/             # Panel principal
│   │   ├── project-detail/        # Detalle de proyecto
│   │   ├── research/              # Historial de investigaciones
│   │   └── notes/                 # Gestión de notas
│   │
│   ├── shared/                    # Componentes compartidos
│   │   └── components/
│   │       └── sidebar/           # Barra de navegación lateral
│   │
│   ├── app.config.ts              # Configuración de la app
│   └── app.routes.ts              # Configuración de rutas
│
├── environments/                  # Configuración de entornos
│   ├── environment.ts             # Desarrollo
│   └── environment.prod.ts        # Producción
│
└── styles.css                     # Estilos globales
```

## 🔑 Funcionalidades Implementadas

### 1. **Autenticación (Auth Module)**
- ✅ Login con JWT
- ✅ Registro de usuarios
- ✅ Renovación automática de tokens
- ✅ Guards de protección de rutas
- ✅ Interceptor HTTP para tokens

**Servicios:**
- `AuthService`: Gestión completa de autenticación

### 2. **Gestión de Proyectos (Projects Module)**
- ✅ Listar proyectos del usuario
- ✅ Crear nuevos proyectos
- ✅ Ver detalles de proyecto
- ✅ Editar proyectos
- ✅ Eliminar proyectos
- ✅ Iniciar investigaciones de oportunidades

**Servicios:**
- `ProjectService`: CRUD completo de proyectos

### 3. **Investigaciones (Research Module)**
- ✅ Ver historial de investigaciones
- ✅ Monitoreo en tiempo real con SSE
- ✅ Métricas de rendimiento
- ✅ Visualización de oportunidades encontradas

**Servicios:**
- `ResearchService`: Consulta de investigaciones y monitoreo SSE

### 4. **Notas (Notes Module)**
- ✅ Crear notas asociadas a proyectos
- ✅ Editar notas existentes
- ✅ Eliminar notas
- ✅ Filtrar por proyecto y tipo

**Servicios:**
- `NoteService`: CRUD completo de notas

## 🎨 Diseño y Estilos

La aplicación utiliza un diseño **Glassmorphism** basado en los conceptos de la carpeta `CONCEPTS/`:

- **Paleta de colores:**
  - Fondo: Gradiente azul oscuro (#0D3262 → #021021)
  - Primario: #00529B
  - Acento: #00BFFF
  - Texto: #E0E0E0
  - Texto secundario: #B0C4DE

- **Efectos:**
  - Backdrop blur para efecto vidrio
  - Sombras suaves
  - Transiciones fluidas
  - Animaciones sutiles

## 📡 Integración con la API

### Endpoints Utilizados

#### Autenticación
- `POST /api/token/` - Login
- `POST /api/token/refresh/` - Renovar token
- `POST /api/users/register/` - Registro
- `GET /api/users/test-auth/` - Verificar autenticación

#### Proyectos
- `GET /api/projects/projects/` - Listar proyectos
- `POST /api/projects/projects/` - Crear proyecto
- `GET /api/projects/projects/:id/` - Obtener proyecto
- `PUT /api/projects/projects/:id/` - Actualizar proyecto
- `PATCH /api/projects/projects/:id/` - Actualización parcial
- `DELETE /api/projects/projects/:id/` - Eliminar proyecto
- `POST /api/projects/projects/:id/run-research/` - Iniciar investigación

#### Research
- `GET /api/projects/research/` - Listar investigaciones
- `GET /api/projects/research/:id/` - Detalle de investigación
- `GET /api/projects/research/latest/` - Última investigación
- `GET /api/projects/research/by-project/:id/` - Por proyecto
- `GET /task-status/:taskId/` - Monitoreo SSE

#### Notas
- `GET /api/projects/notes/` - Listar notas
- `POST /api/projects/notes/` - Crear nota
- `GET /api/projects/notes/:id/` - Obtener nota
- `PUT /api/projects/notes/:id/` - Actualizar nota
- `PATCH /api/projects/notes/:id/` - Actualización parcial
- `DELETE /api/projects/notes/:id/` - Eliminar nota
- `GET /api/projects/notes/by-project/:id/` - Por proyecto
- `GET /api/projects/notes/by-type/:type/` - Por tipo

### Manejo de Autenticación

El sistema utiliza JWT almacenado en `localStorage`:
- `access_token`: Token de acceso (corta duración)
- `refresh_token`: Token de renovación (larga duración)

El interceptor HTTP agrega automáticamente el token a todas las peticiones protegidas.

## 🔒 Seguridad

### Mejores Prácticas Implementadas

1. **Tokens JWT:**
   - Almacenamiento en localStorage
   - Renovación automática
   - Limpieza al cerrar sesión

2. **Guards de Ruta:**
   - `authGuard`: Protege rutas privadas
   - `publicGuard`: Previene acceso a login si ya está autenticado

3. **Interceptores:**
   - Inyección automática de tokens
   - Manejo de errores 401
   - Redirección automática al login

4. **Validación:**
   - Validación de formularios
   - Manejo de errores del backend
   - Mensajes de error descriptivos

## 🧪 Testing

Para ejecutar las pruebas:

```bash
# Pruebas unitarias
npm test

# Pruebas con cobertura
npm run test:coverage

# Pruebas e2e
npm run e2e
```

## 📝 Documentación del Código

Todos los servicios, componentes y funciones están documentados con JSDoc:

```typescript
/**
 * Descripción de la función
 * 
 * @param param1 - Descripción del parámetro
 * @returns Descripción del retorno
 */
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to API"
- Verifica que la URL en `environment.ts` sea correcta
- Asegúrate de que el backend esté ejecutándose
- Revisa la configuración de CORS en el backend

### Error: "401 Unauthorized"
- El token puede haber expirado
- Cierra sesión y vuelve a iniciar sesión
- Verifica que el backend esté configurado correctamente

### Error: "SSE connection failed"
- Verifica que el endpoint de SSE esté disponible
- Revisa la configuración de red/firewall
- Asegúrate de que el backend soporte SSE

## 📦 Dependencias Principales

- **Angular 20.3**: Framework principal
- **RxJS 7.8**: Programación reactiva
- **TypeScript 5.9**: Lenguaje tipado

## 🚢 Despliegue

### Despliegue en Producción

1. **Configurar URL de producción:**
   ```typescript
   // src/environments/environment.prod.ts
   export const environment = {
     production: true,
     apiUrl: 'https://api.tudominio.com'
   };
   ```

2. **Compilar:**
   ```bash
   ng build --configuration production
   ```

3. **Desplegar archivos de `dist/` en tu servidor web**

### Opciones de Hosting
- **Vercel**: Ideal para Angular
- **Netlify**: Fácil configuración
- **AWS S3 + CloudFront**: Escalable
- **Firebase Hosting**: Integración con Google

## 📞 Soporte

Para problemas o preguntas:
1. Revisa la documentación de la API en `API_USE_DOCUMENTATION.MD`
2. Consulta los logs del navegador (F12)
3. Verifica la configuración de entorno

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado con ❤️ usando Angular 20 y las mejores prácticas de desarrollo**
