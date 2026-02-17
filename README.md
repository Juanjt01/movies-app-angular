# Movies App - Frontend

Aplicación web full-stack para gestión de películas con sistema de reseñas y calificaciones.

[![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=flat&logo=angular)](https://angular.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat&logo=bootstrap)](https://getbootstrap.com/)

## Demo en Vivo

**[Ver Aplicación](https://movies-app-angular-three.vercel.app/)** | **[Ver API](https://movies-api-laravel-production-61fb.up.railway.app)**

---

## Capturas de Pantalla

### Login
*[Próximamente]*

### Lista de Películas
*[Próximamente]*

### Detalle y Reviews
*[Próximamente]*

---

## Características

### Autenticación
- Login y registro de usuarios
- Tokens JWT con Laravel Sanctum
- Protección de rutas con Guards
- Gestión de sesión persistente

### Gestión de Películas
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Subida de imágenes para posters
- Preview de imágenes antes de guardar
- Validación de formularios en tiempo real
- Mensajes de éxito y error

### Sistema de Reviews
- Calificaciones de 1 a 5 estrellas interactivas
- Comentarios de texto
- Solo usuarios autenticados pueden opinar
- Visualización de todas las reviews por película
- Indicador de review propia con badge "Tú"

### Diseño y UX
- Interfaz responsive con Bootstrap 5
- Optimizado para móviles y desktop
- Gradientes personalizados
- Animaciones suaves en botones y cards
- Spinner de carga durante peticiones HTTP

---

## Stack Tecnológico

### Frontend
- **Angular 19** - Framework JavaScript
- **TypeScript 5.6** - Lenguaje de programación
- **RxJS** - Programación reactiva para manejo de observables
- **Bootstrap 5** - Framework CSS
- **Angular Router** - Sistema de navegación con guards
- **FormsModule** - Manejo de formularios template-driven
- **HTTP Client** - Comunicación con API REST

### Backend
- **Laravel 11** - API RESTful
- **MySQL 8** - Base de datos
- **Laravel Sanctum** - Autenticación
- **Docker** - Containerización

---

## Arquitectura del Proyecto
```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts          # Protección de rutas privadas
│   ├── services/
│   │   ├── auth.service.ts        # Servicio de autenticación
│   │   ├── movies.service.ts      # Servicio de películas
│   │   └── reviews.service.ts     # Servicio de reviews
│   └── interceptors/              # Interceptores HTTP (futuro)
├── features/
│   ├── auth/
│   │   ├── login/                 # Componente de login
│   │   └── register/              # Componente de registro
│   └── movies/
│       ├── movie-list/            # Listar películas en cards
│       ├── movie-create/          # Crear película con upload
│       ├── movie-detail/          # Ver detalles + reviews
│       └── movie-edit/            # Editar película
└── shared/                        # Componentes compartidos
    └── models/                    # Interfaces TypeScript
```

---

## Instalación y Uso

### Prerrequisitos
- Node.js 18.19 o superior
- npm 9 o superior
- Angular CLI 19

### Instalación Local
```bash
# Clonar repositorio
git clone https://github.com/Juanjt01/movies-app-angular.git
cd movies-app-angular

# Instalar dependencias
npm install

# Servir en desarrollo
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

### Build de Producción
```bash
# Compilar para producción
npm run build

# Los archivos compilados estarán en:
# dist/movies-app/browser
```

---

## Configuración

### Variables de Entorno

Para desarrollo local, el proyecto usa un proxy configurado en `proxy.conf.json`:
```json
{
  "/api": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  },
  "/sanctum": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true
  }
}
```

En producción, las URLs se configuran directamente en los componentes mediante la variable `storageUrl`.

---

## Funcionalidades Técnicas

### Guards de Autenticación

Protección de rutas implementada con Angular Guards:
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
```

Aplicado en rutas:
```typescript
{ 
  path: 'movies', 
  component: MovieListComponent,
  canActivate: [authGuard]
}
```

### Servicios HTTP con Observables

Comunicación con API RESTful mediante RxJS:
```typescript
getMovies(): Observable<MoviesResponse> {
  return this.http.get<MoviesResponse>(`${this.apiUrl}/movies`, {
    headers: this.getHeaders()
  });
}

login(username: string, password: string): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
    username,
    password
  }).pipe(
    tap(response => {
      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
      }
    })
  );
}
```

### Manejo de Formularios

Template-driven forms con validación:
```html
<form (ngSubmit)="onLogin()">
  <input 
    type="text" 
    [(ngModel)]="username" 
    name="username"
    required
  />
  <button type="submit" [disabled]="isLoading">
    Iniciar Sesión
  </button>
</form>
```

### Upload de Imágenes con Preview
```typescript
onFileSelected(event: any): void {
  const file = event.target.files[0];
  
  if (file) {
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
```

---

## Rutas de la Aplicación
```typescript
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'movies', 
    component: MovieListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'movies/create', 
    component: MovieCreateComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'movies/:id/edit', 
    component: MovieEditComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'movies/:id', 
    component: MovieDetailComponent,
    canActivate: [authGuard]
  }
];
```

---

## Endpoints de la API Consumidos

### Autenticación
```
POST   /api/register    - Registro de usuario
POST   /api/login       - Inicio de sesión
POST   /api/logout      - Cierre de sesión
```

### Películas (Protegidas)
```
GET    /api/movies           - Listar películas
POST   /api/movies           - Crear película
GET    /api/movies/{id}      - Ver detalle
PUT    /api/movies/{id}      - Actualizar película
DELETE /api/movies/{id}      - Eliminar película
```

### Reviews (Protegidas)
```
GET    /api/movies/{id}/reviews    - Listar reviews
POST   /api/movies/{id}/reviews    - Crear review
```

---

## Deployment en Vercel

### Configuración
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/movies-app/browser",
  "framework": "angular"
}
```

### Variables de Entorno en Producción
Las URLs de la API se configuran directamente en los componentes para simplificar el deployment.

---

## Diseño y Estilos

### Paleta de Colores
```css
/* Gradiente principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Colores de estado */
--primary: #667eea;
--success: #155724;
--danger: #dc3545;
--warning: #856404;
```

### Componentes Destacados
- Cards con hover effect y sombras
- Botones con gradientes y transiciones
- Formularios con validación visual
- Spinners de carga animados
- Badges para estado de publicación

---

## Mejores Prácticas Implementadas

- Separación de responsabilidades (servicios, componentes, guards)
- Standalone components (Angular 19)
- Tipado estricto con TypeScript
- Manejo de errores con try-catch
- Loading states para mejor UX
- Mensajes de feedback al usuario
- Responsive design mobile-first
- Clean code y nomenclatura consistente

---

## Repositorios Relacionados

- **Backend API Laravel**: [movies-api-laravel](https://github.com/Juanjt01/movies-api-laravel)
- **Deploy Frontend**: [Vercel](https://movies-app-angular-three.vercel.app/)
- **Deploy Backend**: [Railway](https://movies-api-laravel-production-61fb.up.railway.app)

---

## Desarrollado Por

**Juan Terán**

- GitHub: [@Juanjt01](https://github.com/Juanjt01)
- LinkedIn: [Juan Terán](https://www.linkedin.com/in/juan-teran-b208b830b/)

---

## Licencia

Este proyecto fue creado con fines educativos y de demostración de habilidades técnicas.
