import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';

/**
 * Configuración de rutas de la aplicación
 * 
 * Estructura:
 * - /auth: Rutas públicas (login, register)
 * - /dashboard: Panel principal (requiere autenticación)
 * - /project/:id: Detalle de proyecto (requiere autenticación)
 * - /research: Historial de investigaciones (requiere autenticación)
 * - /notes: Gestión de notas (requiere autenticación)
 */
export const routes: Routes = [
  // Redirección por defecto
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Rutas de autenticación (públicas)
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // Rutas protegidas (requieren autenticación)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'project/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
  },
  {
    path: 'research',
    canActivate: [authGuard],
    loadComponent: () => import('./features/research/research.component').then(m => m.ResearchComponent)
  },
  {
    path: 'notes',
    canActivate: [authGuard],
    loadComponent: () => import('./features/notes/notes.component').then(m => m.NotesComponent)
  },

  // Ruta 404
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
