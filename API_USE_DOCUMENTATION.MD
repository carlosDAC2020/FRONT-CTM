# API-CTM - Plataforma de Investigación de Oportunidades con IA

Una plataforma backend robusta y escalable para la **ejecución asíncrona de flujos de agentes de IA** especializados en investigación de oportunidades de financiamiento y convocatorias. Construida con Django, Celery y LangChain, ofrece un sistema completo de gestión de proyectos, autenticación JWT y procesamiento asíncrono con feedback en tiempo real.

## ✨ Características Principales

-   **🔐 Autenticación JWT**: Sistema completo de registro, login y autenticación basado en tokens JWT
-   **📊 Gestión de Proyectos**: CRUD completo para proyectos con investigación automatizada de oportunidades
-   **🤖 Flujos de IA Asíncronos**: Ejecución de agentes especializados en investigación con LangChain
-   **⚡ Procesamiento en Tiempo Real**: Server-Sent Events (SSE) para feedback instantáneo del progreso
-   **📧 Sistema de Notificaciones**: Envío asíncrono de correos electrónicos con plantillas personalizables
-   **🐳 Arquitectura Escalable**: Orquestación completa con Docker Compose (Django, Celery, Redis, PostgreSQL)
-   **📈 Métricas y Reportes**: Seguimiento detallado de resultados y generación de reportes automáticos

## 🏗️ Arquitectura del Sistema

El flujo de comunicación y ejecución sigue el siguiente patrón:

![Diagrama](/docs/diagrama%20de%20ejeucion.png)

1.  El **Cliente** se autentica y obtiene un token JWT
2.  **Cliente** envía peticiones autenticadas para gestionar proyectos
3.  **Django** crea tareas de investigación en Celery y las envía al broker **Redis**
4.  **Worker de Celery** ejecuta los flujos de IA y actualiza el estado en Redis
5.  **Cliente** recibe actualizaciones en tiempo real vía Server-Sent Events (SSE)

## 🛠️ Stack Tecnológico

-   **Backend**: Django REST Framework
-   **Autenticación**: JWT (Simple JWT)
-   **Tareas Asíncronas**: Celery
-   **Broker de Mensajes y Caché**: Redis
-   **Base de Datos**: PostgreSQL
-   **Orquestación de Contenedores**: Docker & Docker Compose
-   **Framework de IA**: LangChain
-   **APIs Externas**: Gemini AI, Tavily Search

## 🚀 Puesta en Marcha

### Prerrequisitos

-   Tener [Docker](https://www.docker.com/get-started) y Docker Compose instalados.

### 1. Clonar el Repositorio

```bash
git clone https://github.com/carlosDAC2020/API-CTM.git
cd API-CTM
```

### 2. Configurar Variables de Entorno

Crea un archivo llamado `.env` en la raíz del proyecto:

```dotenv
# Clave secreta de Django
SECRET_KEY=tu_secret_key_aqui

# Configuración de la Base de Datos PostgreSQL
POSTGRES_DB=django_db
POSTGRES_USER=django_user
POSTGRES_PASSWORD=supersecretpassword
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Claves de APIs para los flujos de LangChain
GEMINI_API_KEY=tu_api_key_de_gemini
TAVILY_API_KEY=tu_api_key_de_tavily
```

### 3. Construir y Levantar los Contenedores

```bash
docker-compose up --build -d
```

### 4. Ejecutar las Migraciones de la Base de Datos

```bash
docker-compose exec backend python manage.py migrate
```

### 5. Acceder a la Aplicación

¡Listo! La API estará disponible en **`http://localhost:8000`**.

---

## 📚 Documentación de la API

### Tabla de Contenidos
- [🔐 Autenticación](#-autenticación)
- [👤 Gestión de Usuarios](#-gestión-de-usuarios)
- [📊 Gestión de Proyectos](#-gestión-de-proyectos)
- [🔬 Gestión de Research (Solo Lectura)](#-gestión-de-research-solo-lectura)
- [📝 Gestión de Notas](#-gestión-de-notas)
- [🤖 Flujos de IA y Tareas Asíncronas](#-flujos-de-ia-y-tareas-asíncronas)
- [📧 Sistema de Notificaciones](#-sistema-de-notificaciones)
- [💻 Ejemplos de Uso en Frontend](#-ejemplos-de-uso-en-frontend)

---

## 🔐 Autenticación

La API utiliza autenticación JWT (JSON Web Tokens) para proteger los endpoints.

### Obtener Token de Acceso

**Endpoint:** `POST /api/token/`

Obtiene un token de acceso y refresh token para un usuario registrado.

#### Request Body
```json
{
    "username": "tu_usuario",
    "password": "tu_contraseña"
}
```

#### Response (200 OK)
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Ejemplo cURL
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "tu_usuario", "password": "tu_contraseña"}'
```

### Renovar Token de Acceso

**Endpoint:** `POST /api/token/refresh/`

Renueva un token de acceso usando el refresh token.

#### Request Body
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Response (200 OK)
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

## 👤 Gestión de Usuarios

### Registrar Usuario

**Endpoint:** `POST /api/users/register/`

Crea una nueva cuenta de usuario.

#### Request Body
```json
{
    "username": "nuevo_usuario",
    "password": "contraseña_segura",
    "email": "usuario@ejemplo.com",
    "first_name": "Nombre",
    "last_name": "Apellido"
}
```

#### Response (201 Created)
```json
{
    "username": "nuevo_usuario",
    "email": "usuario@ejemplo.com",
    "first_name": "Nombre",
    "last_name": "Apellido"
}
```

#### Ejemplo cURL
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nuevo_usuario",
    "password": "contraseña_segura",
    "email": "usuario@ejemplo.com",
    "first_name": "Nombre",
    "last_name": "Apellido"
  }'
```

### Verificar Autenticación

**Endpoint:** `GET /api/users/test-auth/`

Verifica que el token JWT es válido y devuelve información del usuario.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### Response (200 OK)
```json
{
    "message": "¡Bienvenido usuario! Esta es una vista protegida.",
    "user_id": 1,
    "user_email": "usuario@ejemplo.com",
    "user_first_name": "Nombre",
    "user_last_name": "Apellido"
}
```

---

## 📊 Gestión de Proyectos

Todos los endpoints de proyectos requieren autenticación JWT.

### Listar Proyectos

**Endpoint:** `GET /api/projects/projects/`

Obtiene todos los proyectos del usuario autenticado.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### Response (200 OK)
```json
[
    {
        "id": 1,
        "title": "Proyecto de IA en Salud",
        "description": "Investigación de oportunidades en inteligencia artificial aplicada a la salud",
        "keywords": ["IA", "salud", "machine learning"],
        "created_at": "2024-01-15T10:30:00Z",
        "user": 1
    }
]
```

### Crear Proyecto

**Endpoint:** `POST /api/projects/projects/`

Crea un nuevo proyecto para el usuario autenticado.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
Content-Type: application/json
```

#### Request Body
```json
{
    "title": "Nuevo Proyecto de Investigación",
    "description": "Descripción detallada del proyecto de investigación",
    "keywords": ["keyword1", "keyword2", "keyword3"]
}
```

#### Response (201 Created)
```json
{
    "id": 2,
    "title": "Nuevo Proyecto de Investigación",
    "description": "Descripción detallada del proyecto de investigación",
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "created_at": "2024-01-15T11:00:00Z",
    "user": 1
}
```

### Obtener Proyecto Específico

**Endpoint:** `GET /api/projects/projects/{id}/`

Obtiene los detalles de un proyecto específico.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### Response (200 OK)
```json
{
    "id": 1,
    "title": "Proyecto de IA en Salud",
    "description": "Investigación de oportunidades en inteligencia artificial aplicada a la salud",
    "keywords": ["IA", "salud", "machine learning"],
    "created_at": "2024-01-15T10:30:00Z",
    "user": 1
}
```

### Actualizar Proyecto

**Endpoint:** `PUT /api/projects/projects/{id}/`

Actualiza completamente un proyecto existente.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
Content-Type: application/json
```

#### Request Body
```json
{
    "title": "Título Actualizado",
    "description": "Nueva descripción del proyecto",
    "keywords": ["nuevas", "palabras", "clave"]
}
```

### Actualización Parcial de Proyecto

**Endpoint:** `PATCH /api/projects/projects/{id}/`

Actualiza parcialmente un proyecto existente.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
Content-Type: application/json
```

#### Request Body
```json
{
    "title": "Solo actualizar el título"
}
```

### Eliminar Proyecto

**Endpoint:** `DELETE /api/projects/projects/{id}/`

Elimina un proyecto existente.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### Response (204 No Content)

### Iniciar Investigación de Oportunidades

**Endpoint:** `POST /api/projects/projects/{id}/run-research/`

Inicia el flujo de investigación automatizada de oportunidades para un proyecto específico.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
Content-Type: application/json
```

#### Response (202 Accepted)
```json
{
    "status": "Investigación iniciada",
    "task_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
}
```

#### Ejemplo cURL
```bash
curl -X POST http://localhost:8000/api/projects/projects/1/run-research/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json"
```

---

## 🔬 Gestión de Research (Solo Lectura)

Los endpoints de research permiten consultar los resultados de las investigaciones ejecutadas, incluyendo métricas de rendimiento y estado de ejecución. Todos los endpoints requieren autenticación JWT.

### Listar Research

**Endpoint:** `GET /api/projects/research/`

Obtiene un resumen de todos los research del usuario autenticado, ordenados por fecha (más recientes primero).

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### Response (200 OK)
```json
[
    {
        "id": 1,
        "project_title": "Proyecto de IA en Salud",
        "date": "2024-01-15T14:30:00Z",
        "status": "COMPLETED",
        "execute_time": 45.67,
        "initial_results_count": 150,
        "relevant_results_count": 45,
        "opportunities_found_count": 12,
        "relevance_ratio": 30.0,
        "opportunity_ratio": 26.67,
        "opportunities_count": 12
    }
]
```

### Obtener Research Específico

**Endpoint:** `GET /api/projects/research/{id}/`

Obtiene los detalles completos de un research específico, incluyendo oportunidades, contextos y reporte.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### Response (200 OK)
```json
{
    "id": 1,
    "project": {
        "id": 1,
        "title": "Proyecto de IA en Salud",
        "description": "Investigación de oportunidades en IA aplicada a la salud",
        "keywords": ["IA", "salud", "machine learning"],
        "created_at": "2024-01-15T10:30:00Z"
    },
    "execute_time": 45.67,
    "date": "2024-01-15T14:30:00Z",
    "status": "COMPLETED",
    "initial_results_count": 150,
    "relevant_results_count": 45,
    "opportunities_found_count": 12,
    "relevance_ratio": 30.0,
    "opportunity_ratio": 26.67,
    "opportunities": [
        {
            "id": 1,
            "origin": "Horizon Europe",
            "description": "Convocatoria para proyectos de IA en salud digital",
            "financing": "€2.5M - €5M",
            "requirements": ["Consorcio internacional", "TRL 4-6"],
            "deadline": "2024-03-15T23:59:59Z",
            "url_to": "https://ec.europa.eu/...",
            "type": "Grant",
            "source_context": {
                "id": 1,
                "title": "Digital Health Innovation Call",
                "description": "Funding for AI healthcare solutions",
                "url": "https://example.com/call",
                "is_relevant": true
            }
        }
    ],
    "contexts": [
        {
            "id": 1,
            "title": "Digital Health Innovation Call",
            "description": "Funding for AI healthcare solutions",
            "url": "https://example.com/call",
            "is_relevant": true
        }
    ],
    "report": {
        "id": 1,
        "date": "2024-01-15T14:35:00Z",
        "path": "/reports/research_1_report.pdf"
    }
}
```

### Obtener Último Research

**Endpoint:** `GET /api/projects/research/latest/`

Devuelve el research más reciente del usuario con información completa.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### Response (200 OK)
Misma estructura que el endpoint de research específico.

#### Response (404 Not Found)
```json
{
    "message": "No se encontraron research"
}
```

### Research por Proyecto

**Endpoint:** `GET /api/projects/research/by-project/{project_id}/`

Obtiene todos los research de un proyecto específico.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### Response (200 OK)
Array con el formato de resumen de research (mismo que el listado general).

#### Ejemplo cURL
```bash
curl -X GET http://localhost:8000/api/projects/research/latest/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

---

## 📝 Gestión de Notas

Los endpoints de notas permiten crear, consultar, editar y eliminar notas asociadas a proyectos. Todos los endpoints requieren autenticación JWT.

### Listar Notas

**Endpoint:** `GET /api/projects/notes/`

Obtiene todas las notas del usuario autenticado, ordenadas por fecha (más recientes primero).

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### Response (200 OK)
```json
[
    {
        "id": 1,
        "project": 1,
        "project_title": "Proyecto de IA en Salud",
        "date": "2024-01-15T16:00:00Z",
        "title": "Reunión con stakeholders",
        "content": "Discutimos los requisitos técnicos y el cronograma del proyecto...",
        "type": "meeting"
    }
]
```

### Crear Nota

**Endpoint:** `POST /api/projects/notes/`

Crea una nueva nota asociada a un proyecto.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
Content-Type: application/json
```

#### Request Body
```json
{
    "project": 1,
    "title": "Nueva nota importante",
    "content": "Contenido detallado de la nota...",
    "type": "research"
}
```

#### Response (201 Created)
```json
{
    "id": 2,
    "project": 1,
    "project_title": "Proyecto de IA en Salud",
    "date": "2024-01-15T16:30:00Z",
    "title": "Nueva nota importante",
    "content": "Contenido detallado de la nota...",
    "type": "research"
}
```

### Obtener Nota Específica

**Endpoint:** `GET /api/projects/notes/{id}/`

Obtiene los detalles de una nota específica.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### Response (200 OK)
Misma estructura que la respuesta de creación.

### Actualizar Nota

**Endpoint:** `PUT /api/projects/notes/{id}/`

Actualiza completamente una nota existente.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
Content-Type: application/json
```

#### Request Body
```json
{
    "project": 1,
    "title": "Título actualizado",
    "content": "Contenido actualizado de la nota...",
    "type": "update"
}
```

### Actualización Parcial de Nota

**Endpoint:** `PATCH /api/projects/notes/{id}/`

Actualiza parcialmente una nota existente.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
Content-Type: application/json
```

#### Request Body
```json
{
    "title": "Solo actualizar el título"
}
```

### Eliminar Nota

**Endpoint:** `DELETE /api/projects/notes/{id}/`

Elimina una nota existente.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### Response (204 No Content)

### Notas por Proyecto

**Endpoint:** `GET /api/projects/notes/by-project/{project_id}/`

Obtiene todas las notas de un proyecto específico.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### Response (200 OK)
Array con el formato estándar de notas.

### Notas por Tipo

**Endpoint:** `GET /api/projects/notes/by-type/{note_type}/`

Obtiene todas las notas de un tipo específico del usuario.

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### Response (200 OK)
Array con el formato estándar de notas.

#### Ejemplo cURL
```bash
curl -X POST http://localhost:8000/api/projects/notes/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "project": 1,
    "title": "Nota de prueba",
    "content": "Contenido de ejemplo",
    "type": "test"
  }'
```

---

## 🤖 Flujos de IA y Tareas Asíncronas

### Iniciar Flujo de IA Genérico

**Endpoint:** `POST /start-task/`

Inicia un flujo de IA genérico. Requiere token CSRF para peticiones desde el navegador.

#### Headers
```
Content-Type: application/json
X-CSRFToken: [csrf_token] # Solo para peticiones desde navegador
```

#### Request Body
```json
{
    "flow": "nombre_del_flujo",
    "inputs": {
        "parametro_1": "valor_1",
        "parametro_2": "valor_2"
    }
}
```

#### Flujos Disponibles

| Flujo | Descripción | Inputs Requeridos |
|-------|-------------|-------------------|
| `poem_flow` | Genera un poema sobre un tema aleatorio | `{}` |
| `web_search_flow` | Busca en la web y resume la respuesta | `{"question": "Tu pregunta aquí..."}` |
| `discovery_opportunities_flow` | Investiga oportunidades de financiamiento | `{"project_details": "Detalles del proyecto"}` |

#### Response (200 OK)
```json
{
    "task_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
}
```

### Monitorear Estado de Tarea (Server-Sent Events)

**Endpoint:** `GET /task-status/{task_id}/`

Establece una conexión SSE para recibir actualizaciones en tiempo real del progreso de la tarea.

#### Headers
```
Accept: text/event-stream
Cache-Control: no-cache
```

#### Formato de Respuesta SSE

```json
{
    "state": "PROGRESS",
    "details": {
        "status": "Ejecutando búsqueda web...",
        "progress": 45,
        "step_results": [
            {
                "type": "log",
                "message": "▶️ Iniciando búsqueda en Tavily..."
            },
            {
                "type": "tool_result",
                "step_name": "Búsqueda Web",
                "tool": "tavily_search_results_json",
                "data": [
                    {
                        "url": "https://ejemplo.com",
                        "content": "Contenido relevante encontrado..."
                    }
                ]
            }
        ],
        "final_result": null
    }
}
```

#### Estados Posibles
- `PENDING`: Tarea en cola
- `PROGRESS`: Tarea en ejecución
- `SUCCESS`: Tarea completada exitosamente
- `FAILURE`: Tarea falló

---

## 📧 Sistema de Notificaciones

### Enviar Notificación por Email

**Endpoint:** `POST /notifications/send-notification/`

Encola una tarea para enviar un correo electrónico de forma asíncrona.

#### Content-Type
```
multipart/form-data
```

#### Form Data
- `recipients` (string, requerido): Emails separados por comas
- `subject` (string, opcional): Asunto del correo
- `body` (string, opcional): Cuerpo del mensaje
- `template_name` (string, opcional): Nombre de la plantilla HTML
- `template_context` (string, opcional): Contexto JSON para la plantilla
- `attachment` (file, opcional): Archivo adjunto

#### Response (200 OK)
```json
{
    "status": "Correo encolado",
    "task_id": "notification-task-id"
}
```

#### Ejemplo cURL
```bash
curl -X POST http://localhost:8000/notifications/send-notification/ \
  -F "recipients=usuario1@ejemplo.com,usuario2@ejemplo.com" \
  -F "subject=Notificación Importante" \
  -F "body=Este es el contenido del mensaje" \
  -F "attachment=@archivo.pdf"
```

### Página de Prueba de Notificaciones

**Endpoint:** `GET /notifications/test-sender/`

Renderiza una página HTML para probar el envío de notificaciones.

---

## 💻 Ejemplos de Uso en Frontend

### Autenticación y Gestión de Tokens

```javascript
class APIClient {
    constructor(baseURL = 'http://localhost:8000') {
        this.baseURL = baseURL;
        this.accessToken = localStorage.getItem('access_token');
        this.refreshToken = localStorage.getItem('refresh_token');
    }

    async login(username, password) {
        const response = await fetch(`${this.baseURL}/api/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            this.accessToken = data.access;
            this.refreshToken = data.refresh;
            localStorage.setItem('access_token', this.accessToken);
            localStorage.setItem('refresh_token', this.refreshToken);
            return data;
        }
        throw new Error('Login failed');
    }

    async refreshAccessToken() {
        const response = await fetch(`${this.baseURL}/api/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: this.refreshToken })
        });

        if (response.ok) {
            const data = await response.json();
            this.accessToken = data.access;
            localStorage.setItem('access_token', this.accessToken);
            return data;
        }
        throw new Error('Token refresh failed');
    }

    getAuthHeaders() {
        return {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
        };
    }
}
```

### Gestión de Proyectos

```javascript
class ProjectManager extends APIClient {
    async createProject(projectData) {
        const response = await fetch(`${this.baseURL}/api/projects/projects/`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(projectData)
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to create project');
    }

    async getProjects() {
        const response = await fetch(`${this.baseURL}/api/projects/projects/`, {
            headers: this.getAuthHeaders()
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to fetch projects');
    }

    async startResearch(projectId) {
        const response = await fetch(`${this.baseURL}/api/projects/projects/${projectId}/run-research/`, {
            method: 'POST',
            headers: this.getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            return data.task_id;
        }
        throw new Error('Failed to start research');
    }
}
```

### Gestión de Research

```javascript
class ResearchManager extends APIClient {
    async getResearchList() {
        const response = await fetch(`${this.baseURL}/api/projects/research/`, {
            headers: this.getAuthHeaders()
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to fetch research list');
    }

    async getResearch(researchId) {
        const response = await fetch(`${this.baseURL}/api/projects/research/${researchId}/`, {
            headers: this.getAuthHeaders()
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to fetch research details');
    }

    async getLatestResearch() {
        const response = await fetch(`${this.baseURL}/api/projects/research/latest/`, {
            headers: this.getAuthHeaders()
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to fetch latest research');
    }

    async getResearchByProject(projectId) {
        const response = await fetch(`${this.baseURL}/api/projects/research/by-project/${projectId}/`, {
            headers: this.getAuthHeaders()
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to fetch research for project');
    }
}
```

### Gestión de Notas

```javascript
class NotesManager extends APIClient {
    async getNotes() {
        const response = await fetch(`${this.baseURL}/api/projects/notes/`, {
            headers: this.getAuthHeaders()
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to fetch notes');
    }

    async createNote(noteData) {
        const response = await fetch(`${this.baseURL}/api/projects/notes/`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(noteData)
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to create note');
    }

    async getNote(noteId) {
        const response = await fetch(`${this.baseURL}/api/projects/notes/${noteId}/`, {
            headers: this.getAuthHeaders()
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to fetch note');
    }

    async updateNote(noteId, noteData) {
        const response = await fetch(`${this.baseURL}/api/projects/notes/${noteId}/`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(noteData)
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to update note');
    }

    async patchNote(noteId, partialData) {
        const response = await fetch(`${this.baseURL}/api/projects/notes/${noteId}/`, {
            method: 'PATCH',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(partialData)
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to patch note');
    }

    async deleteNote(noteId) {
        const response = await fetch(`${this.baseURL}/api/projects/notes/${noteId}/`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        });

        if (response.ok) {
            return true;
        }
        throw new Error('Failed to delete note');
    }

    async getNotesByProject(projectId) {
        const response = await fetch(`${this.baseURL}/api/projects/notes/by-project/${projectId}/`, {
            headers: this.getAuthHeaders()
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to fetch notes for project');
    }

    async getNotesByType(noteType) {
        const response = await fetch(`${this.baseURL}/api/projects/notes/by-type/${noteType}/`, {
            headers: this.getAuthHeaders()
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to fetch notes by type');
    }
}
```

### Monitoreo de Tareas con SSE

```javascript
class TaskMonitor {
    constructor(baseURL = 'http://localhost:8000') {
        this.baseURL = baseURL;
    }

    monitorTask(taskId, onUpdate, onComplete, onError) {
        const eventSource = new EventSource(`${this.baseURL}/task-status/${taskId}/`);

        eventSource.onmessage = function(event) {
            const data = JSON.parse(event.data);
            
            // Llamar callback de actualización
            if (onUpdate) onUpdate(data);

            // Si la tarea terminó, cerrar conexión
            if (data.state === 'SUCCESS' || data.state === 'FAILURE') {
                eventSource.close();
                if (onComplete) onComplete(data);
            }
        };

        eventSource.onerror = function(error) {
            console.error('Error en SSE:', error);
            eventSource.close();
            if (onError) onError(error);
        };

        return eventSource;
    }
}
```

### Ejemplo de Uso Completo

```javascript
// Inicializar clientes
const projectManager = new ProjectManager();
const taskMonitor = new TaskMonitor();

// Función para iniciar investigación con monitoreo
async function startProjectResearch(projectId) {
    try {
        // Iniciar investigación
        const taskId = await projectManager.startResearch(projectId);
        console.log('Investigación iniciada:', taskId);

        // Monitorear progreso
        const eventSource = taskMonitor.monitorTask(
            taskId,
            // onUpdate
            (data) => {
                console.log('Progreso:', data.details.progress + '%');
                console.log('Estado:', data.details.status);
                updateProgressBar(data.details.progress);
            },
            // onComplete
            (data) => {
                if (data.state === 'SUCCESS') {
                    console.log('Investigación completada:', data.details.final_result);
                    showResults(data.details.final_result);
                } else {
                    console.error('Investigación falló:', data.details);
                    showError('La investigación falló');
                }
            },
            // onError
            (error) => {
                console.error('Error en monitoreo:', error);
                showError('Error en la conexión');
            }
        );

    } catch (error) {
        console.error('Error:', error);
        showError('No se pudo iniciar la investigación');
    }
}

// Inicializar gestores adicionales
const researchManager = new ResearchManager();
const notesManager = new NotesManager();

// Función para mostrar el último research con métricas
async function showLatestResearch() {
    try {
        const research = await researchManager.getLatestResearch();
        console.log('Último research:', research);
        
        // Mostrar métricas
        console.log(`Ratio de relevancia: ${research.relevance_ratio}%`);
        console.log(`Ratio de oportunidades: ${research.opportunity_ratio}%`);
        console.log(`Oportunidades encontradas: ${research.opportunities_found_count}`);
        
        displayResearchMetrics(research);
    } catch (error) {
        console.error('Error al obtener research:', error);
    }
}

// Función para crear una nota
async function createProjectNote(projectId, title, content, type = 'general') {
    try {
        const noteData = {
            project: projectId,
            title: title,
            content: content,
            type: type
        };
        
        const newNote = await notesManager.createNote(noteData);
        console.log('Nota creada:', newNote);
        
        // Actualizar UI
        addNoteToUI(newNote);
        return newNote;
    } catch (error) {
        console.error('Error al crear nota:', error);
        showError('No se pudo crear la nota');
    }
}

// Función para obtener todas las notas de un proyecto
async function loadProjectNotes(projectId) {
    try {
        const notes = await notesManager.getNotesByProject(projectId);
        console.log(`Notas del proyecto ${projectId}:`, notes);
        
        // Mostrar notas en la UI
        displayNotes(notes);
        return notes;
    } catch (error) {
        console.error('Error al cargar notas:', error);
        showError('No se pudieron cargar las notas');
    }
}

// Funciones auxiliares para UI
function updateProgressBar(progress) {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = progress + '%';
        progressBar.textContent = progress + '%';
    }
}

function showResults(results) {
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        resultsDiv.innerHTML = `<pre>${JSON.stringify(results, null, 2)}</pre>`;
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function displayResearchMetrics(research) {
    const metricsDiv = document.getElementById('research-metrics');
    if (metricsDiv) {
        metricsDiv.innerHTML = `
            <h3>Métricas del Research</h3>
            <p><strong>Estado:</strong> ${research.status}</p>
            <p><strong>Tiempo de ejecución:</strong> ${research.execute_time}s</p>
            <p><strong>Resultados iniciales:</strong> ${research.initial_results_count}</p>
            <p><strong>Resultados relevantes:</strong> ${research.relevant_results_count}</p>
            <p><strong>Oportunidades encontradas:</strong> ${research.opportunities_found_count}</p>
            <p><strong>Ratio de relevancia:</strong> ${research.relevance_ratio.toFixed(2)}%</p>
            <p><strong>Ratio de oportunidades:</strong> ${research.opportunity_ratio.toFixed(2)}%</p>
        `;
    }
}

function displayNotes(notes) {
    const notesDiv = document.getElementById('notes-list');
    if (notesDiv) {
        notesDiv.innerHTML = notes.map(note => `
            <div class="note-item" data-note-id="${note.id}">
                <h4>${note.title}</h4>
                <p><strong>Proyecto:</strong> ${note.project_title}</p>
                <p><strong>Tipo:</strong> ${note.type}</p>
                <p><strong>Fecha:</strong> ${new Date(note.date).toLocaleDateString()}</p>
                <p>${note.content}</p>
                <button onclick="editNote(${note.id})">Editar</button>
                <button onclick="deleteNote(${note.id})">Eliminar</button>
            </div>
        `).join('');
    }
}

function addNoteToUI(note) {
    const notesDiv = document.getElementById('notes-list');
    if (notesDiv) {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.setAttribute('data-note-id', note.id);
        noteElement.innerHTML = `
            <h4>${note.title}</h4>
            <p><strong>Proyecto:</strong> ${note.project_title}</p>
            <p><strong>Tipo:</strong> ${note.type}</p>
            <p><strong>Fecha:</strong> ${new Date(note.date).toLocaleDateString()}</p>
            <p>${note.content}</p>
            <button onclick="editNote(${note.id})">Editar</button>
            <button onclick="deleteNote(${note.id})">Eliminar</button>
        `;
        notesDiv.insertBefore(noteElement, notesDiv.firstChild);
    }
}

async function editNote(noteId) {
    try {
        const note = await notesManager.getNote(noteId);
        const newTitle = prompt('Nuevo título:', note.title);
        const newContent = prompt('Nuevo contenido:', note.content);
        
        if (newTitle && newContent) {
            const updatedNote = await notesManager.patchNote(noteId, {
                title: newTitle,
                content: newContent
            });
            
            // Actualizar UI
            const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
            if (noteElement) {
                noteElement.querySelector('h4').textContent = updatedNote.title;
                noteElement.querySelector('p:last-of-type').textContent = updatedNote.content;
            }
        }
    } catch (error) {
        console.error('Error al editar nota:', error);
        showError('No se pudo editar la nota');
    }
}

async function deleteNote(noteId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
        try {
            await notesManager.deleteNote(noteId);
            
            // Remover de UI
            const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
            if (noteElement) {
                noteElement.remove();
            }
        } catch (error) {
            console.error('Error al eliminar nota:', error);
            showError('No se pudo eliminar la nota');
        }
    }
}
```

### Ejemplo de Formulario de Registro

```html
<!DOCTYPE html>
<html>
<head>
    <title>Registro - API-CTM</title>
</head>
<body>
    <form id="register-form">
        <input type="text" id="username" placeholder="Usuario" required>
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Contraseña" required>
        <input type="text" id="first_name" placeholder="Nombre">
        <input type="text" id="last_name" placeholder="Apellido">
        <button type="submit">Registrarse</button>
    </form>

    <script>
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                first_name: document.getElementById('first_name').value,
                last_name: document.getElementById('last_name').value
            };

            try {
                const response = await fetch('http://localhost:8000/api/users/register/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const userData = await response.json();
                    alert('Usuario registrado exitosamente');
                    console.log('Usuario creado:', userData);
                } else {
                    const errorData = await response.json();
                    alert('Error en el registro: ' + JSON.stringify(errorData));
                }
            } catch (error) {
                alert('Error de conexión: ' + error.message);
            }
        });
    </script>
</body>
</html>
```

---

## 🧩 Cómo Añadir Nuevos Flujos de IA

La arquitectura está diseñada para ser fácilmente extensible. Para añadir un nuevo flujo:

1.  **Define el Flujo**: Ve al archivo `main/tasks.py` y crea una nueva función que construya y devuelva tu cadena de LangChain.
2.  **Regístralo**: Añade la función al diccionario `FLOW_REGISTRY` con un nombre único.
3.  **Actualiza la Documentación**: Añade el nuevo flujo a la tabla de flujos disponibles.

```python
# Ejemplo en main/tasks.py
def _create_mi_nuevo_flujo(llm):
    # Tu lógica de LangChain aquí
    return chain

FLOW_REGISTRY = {
    "poem_flow": _create_poem_flow,
    "web_search_flow": _create_web_search_flow,
    "mi_nuevo_flujo": _create_mi_nuevo_flujo,  # <-- Tu nuevo flujo
}
```

---

## 📝 Notas Importantes

- **Autenticación**: Todos los endpoints de proyectos requieren autenticación JWT
- **CORS**: Configura CORS apropiadamente para peticiones desde el frontend
- **Rate Limiting**: Considera implementar rate limiting para endpoints públicos
- **Logs**: Revisa los logs de Celery para debugging de tareas asíncronas
- **Escalabilidad**: Puedes escalar horizontalmente añadiendo más workers de Celery

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
