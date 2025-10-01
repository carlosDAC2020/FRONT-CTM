import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResearchSummary, ResearchDetail, TaskProgress } from '../models/research.model';

/**
 * Servicio de Research (Investigaciones)
 * 
 * Gestiona las operaciones de consulta de investigaciones:
 * - Listar investigaciones del usuario
 * - Obtener detalles de una investigación
 * - Obtener la última investigación
 * - Filtrar investigaciones por proyecto
 * - Monitorear progreso de tareas con SSE
 */
@Injectable({
  providedIn: 'root'
})
export class ResearchService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/projects`;
  private readonly baseUrl = environment.apiUrl;

  /**
   * Obtiene todas las investigaciones del usuario autenticado
   * Ordenadas por fecha (más recientes primero)
   * 
   * @returns Observable con array de resúmenes de investigaciones
   */
  getResearchList(): Observable<ResearchSummary[]> {
    return this.http.get<ResearchSummary[]>(`${this.apiUrl}/research/`);
  }

  /**
   * Obtiene los detalles completos de una investigación específica
   * Incluye oportunidades, contextos y reporte
   * 
   * @param id - ID de la investigación
   * @returns Observable con los detalles completos
   */
  getResearch(id: number): Observable<ResearchDetail> {
    return this.http.get<ResearchDetail>(`${this.apiUrl}/research/${id}/`);
  }

  /**
   * Obtiene la investigación más reciente del usuario
   * 
   * @returns Observable con los detalles de la última investigación
   */
  getLatestResearch(): Observable<ResearchDetail> {
    return this.http.get<ResearchDetail>(`${this.apiUrl}/research/latest/`);
  }

  /**
   * Obtiene todas las investigaciones de un proyecto específico
   * 
   * @param projectId - ID del proyecto
   * @returns Observable con array de resúmenes de investigaciones
   */
  getResearchByProject(projectId: number): Observable<ResearchSummary[]> {
    return this.http.get<ResearchSummary[]>(
      `${this.apiUrl}/research/by-project/${projectId}/`
    );
  }

  /**
   * Monitorea el progreso de una tarea asíncrona usando Server-Sent Events (SSE)
   * 
   * @param taskId - ID de la tarea a monitorear
   * @returns Observable que emite actualizaciones de progreso en tiempo real
   */
  monitorTask(taskId: string): Observable<TaskProgress> {
    return new Observable<TaskProgress>(observer => {
      const eventSource = new EventSource(`${this.baseUrl}/task-status/${taskId}/`);

      eventSource.onmessage = (event) => {
        try {
          const data: TaskProgress = JSON.parse(event.data);
          observer.next(data);

          // Si la tarea terminó (éxito o fallo), cerrar conexión
          if (data.state === 'SUCCESS' || data.state === 'FAILURE') {
            eventSource.close();
            observer.complete();
          }
        } catch (error) {
          observer.error(error);
          eventSource.close();
        }
      };

      eventSource.onerror = (error) => {
        observer.error(error);
        eventSource.close();
      };

      // Cleanup cuando se desuscribe
      return () => {
        eventSource.close();
      };
    });
  }
}
