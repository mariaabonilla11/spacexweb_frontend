# SpaceX Web Frontend

Frontend de la aplicación web SpaceX desarrollado con Vue.js 2 que consume datos de lanzamientos de SpaceX desde DynamoDB a través de una API REST. Proporciona una interfaz moderna y responsiva para visualizar y explorar información de misiones espaciales.

## 🚀 Características

- **Dashboard interactivo** con estadísticas de lanzamientos
- **Filtros avanzados** por misión, estado, fecha y cohete
- **Visualización de datos** clara y atractiva
- **Interfaz responsiva** compatible con dispositivos móviles
- **Integración completa** con API REST del backend

## 🛠️ Tecnologías

- **Vue.js 2** - Framework principal
- **Vue Router** - Navegación SPA
- **Axios** - Cliente HTTP para API
- **CSS3** - Estilos y diseño responsivo
- **Docker** - Containerización
- **Nginx** - Servidor web en producción

## 📋 Requisitos Previos

- Node.js >= 14.x
- npm >= 6.x
- Docker (para containerización)
- Acceso al backend de SpaceX API

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/mariaabonilla11/spacexweb_frontend.git
cd spacexweb_frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo de ejemplo y configurar las variables:

```bash
cp .env-example .env
```

Editar `.env` con la configuración apropiada:

```env
VUE_APP_API_BASE_URL=http://localhost:8000/api/v1
VUE_APP_API_TIMEOUT=10000
```

### 4. Ejecutar en modo desarrollo

```bash
npm run serve
```

La aplicación estará disponible en `http://localhost:8080`

## 🐳 Docker

### Construcción de la imagen

```bash
docker build -t spacex-frontend .
```

### Ejecutar contenedor

```bash
docker run -d -p 80:80 --name spacex-frontend spacex-frontend
```

La aplicación estará disponible en `http://localhost`

## 📁 Estructura del Proyecto

```
spacexweb_frontend/
├── public/                 # Archivos estáticos
│   ├── index.html         # Template HTML principal
│   └── favicon.ico        # Icono de la aplicación
├── src/
│   ├── components/        # Componentes Vue reutilizables
│   │   ├── Dashboard.vue  # Dashboard principal
│   │   ├── Filters.vue    # Componente de filtros
│   │   └── MissionCard.vue # Tarjeta de misión
│   ├── views/             # Vistas principales
│   │   ├── Home.vue       # Vista principal
│   │   └── Missions.vue   # Vista de misiones
│   ├── services/          # Servicios de API
│   │   └── api.js         # Cliente HTTP configurado
│   ├── router/            # Configuración de rutas
│   │   └── index.js       # Router principal
│   ├── assets/            # Recursos estáticos
│   ├── App.vue            # Componente raíz
│   └── main.js            # Punto de entrada
├── Dockerfile             # Configuración Docker
├── nginx.conf             # Configuración Nginx
├── package.json           # Dependencias y scripts
└── .env-example           # Variables de entorno ejemplo
```

## 🎯 Funcionalidades Principales

### Dashboard de Misiones

- **Total de lanzamientos registrados**: Contador dinámico
- **Lanzamientos exitosos**: Estadísticas de éxito
- **Lanzamientos fallidos**: Análisis de fallos
- **Tasa de éxito**: Porcentaje calculado en tiempo real

### Sistema de Filtros

- **Por misión**: Búsqueda por nombre de misión
- **Por estado**: Exitoso, fallido, en progreso
- **Por fecha**: Rango de fechas personalizable
- **Por cohete**: Filtro por tipo de cohete utilizado

### Visualización de Datos

- **Tarjetas de misión**: Información detallada de cada lanzamiento
- **Gráficos de tendencia**: Visualización temporal de lanzamientos
- **Tablas responsivas**: Listado completo con paginación

## 🔌 Integración con Backend

El frontend se comunica con el backend FastAPI a través de los siguientes endpoints:

- `GET /api/v1/launches` - Obtener todos los lanzamientos
- `GET /api/v1/launches/{id}` - Obtener lanzamiento específico
- `GET /api/v1/health` - Health check del servicio
- `GET /api/v1/stats` - Estadísticas generales

## 🚀 Despliegue

### Desarrollo Local

```bash
npm run serve
```

### Construcción para Producción

```bash
npm run build
```

### Docker Compose (Proyecto Completo)

Desde el repositorio principal `spacex_web_fullstack`:

```bash
docker-compose build
docker-compose up
```

## 🌐 URLs de Acceso

- **Aplicación Web**: http://spacex-app-alb-1144963660.us-east-1.elb.amazonaws.com/
- **API Documentation**: http://spacex-app-alb-1144963660.us-east-1.elb.amazonaws.com/api/v1/docs

## 🔒 Configuración de Producción

En producción, el frontend se despliega en AWS ECS Fargate con:

- **Load Balancer**: Application Load Balancer para distribución de tráfico
- **Auto Scaling**: Escalado automático basado en demanda
- **Health Checks**: Monitoreo continuo de salud de la aplicación
- **HTTPS**: Terminación SSL en el Load Balancer

## 📊 Scripts Disponibles

```bash
# Desarrollo
npm run serve          # Servidor de desarrollo

# Construcción
npm run build          # Build para producción
npm run build --report # Build con análisis de bundle

```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 👨‍💻 Autor

**Maria del Pilar Bonilla**

- GitHub: [@mariaabonilla11](https://github.com/mariaabonilla11)

## 🔗 Repositorios Relacionados

- **Backend**: [spacex_web_backend](https://github.com/mariaabonilla11/spacex_web_backend)
- **Infraestructura**: [spacex_web_fullstack](https://github.com/mariaabonilla11/spacex_web_fullstack)
- **Lambda**: [spacex_fullstack](https://github.com/mariaabonilla11/spacex_fullstack)
