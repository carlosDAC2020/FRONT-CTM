import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project, ProjectCreate, ResearchStartResponse } from '../models/project.model';

/**
 * Servicio de Proyectos
 * 
 * Gestiona todas las operaciones CRUD de proyectos:
 * - Listar proyectos del usuario
 * - Crear nuevos proyectos
 * - Obtener detalles de un proyecto
 * - Actualizar proyectos
 * - Eliminar proyectos
 * - Iniciar investigación de oportunidades
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/projects`;

  /**
   * Obtiene todos los proyectos del usuario autenticado
   * 
   * @returns Observable con array de proyectos
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects/`);
  }

  /**
   * Obtiene un proyecto específico por ID
   * 
   * @param id - ID del proyecto
   * @returns Observable con los datos del proyecto
   */
  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${id}/`);
  }

  /**
   * Crea un nuevo proyecto
   * 
   * @param project - Datos del proyecto a crear
   * @returns Observable con el proyecto creado
   */
  createProject(project: ProjectCreate): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects/`, project);
  }

  /**
   * Actualiza completamente un proyecto existente
   * 
   * @param id - ID del proyecto
   * @param project - Datos completos del proyecto
   * @returns Observable con el proyecto actualizado
   */
  updateProject(id: number, project: ProjectCreate): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/projects/${id}/`, project);
  }

  /**
   * Actualiza parcialmente un proyecto existente
   * 
   * @param id - ID del proyecto
   * @param partialProject - Datos parciales a actualizar
   * @returns Observable con el proyecto actualizado
   */
  patchProject(id: number, partialProject: Partial<ProjectCreate>): Observable<Project> {
    return this.http.patch<Project>(`${this.apiUrl}/projects/${id}/`, partialProject);
  }

  /**
   * Elimina un proyecto
   * 
   * @param id - ID del proyecto a eliminar
   * @returns Observable vacío
   */
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${id}/`);
  }

  /**
   * Inicia el flujo de investigación de oportunidades para un proyecto
   * 
   * @param id - ID del proyecto
   * @returns Observable con el ID de la tarea asíncrona iniciada
   */
  runResearch(id: number): Observable<ResearchStartResponse> {
    return this.http.post<ResearchStartResponse>(
      `${this.apiUrl}/projects/${id}/run-research/`,
      {}
    );
  }
}
