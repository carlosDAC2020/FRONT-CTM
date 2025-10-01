import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Note, NoteCreate, NoteUpdate } from '../models/note.model';

/**
 * Servicio de Notas
 * 
 * Gestiona todas las operaciones CRUD de notas:
 * - Listar notas del usuario
 * - Crear nuevas notas
 * - Obtener detalles de una nota
 * - Actualizar notas
 * - Eliminar notas
 * - Filtrar notas por proyecto o tipo
 */
@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/projects`;

  /**
   * Obtiene todas las notas del usuario autenticado
   * Ordenadas por fecha (más recientes primero)
   * 
   * @returns Observable con array de notas
   */
  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/notes/`);
  }

  /**
   * Obtiene una nota específica por ID
   * 
   * @param id - ID de la nota
   * @returns Observable con los datos de la nota
   */
  getNote(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/notes/${id}/`);
  }

  /**
   * Crea una nueva nota
   * 
   * @param note - Datos de la nota a crear
   * @returns Observable con la nota creada
   */
  createNote(note: NoteCreate): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}/notes/`, note);
  }

  /**
   * Actualiza completamente una nota existente
   * 
   * @param id - ID de la nota
   * @param note - Datos completos de la nota
   * @returns Observable con la nota actualizada
   */
  updateNote(id: number, note: NoteCreate): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/notes/${id}/`, note);
  }

  /**
   * Actualiza parcialmente una nota existente
   * 
   * @param id - ID de la nota
   * @param partialNote - Datos parciales a actualizar
   * @returns Observable con la nota actualizada
   */
  patchNote(id: number, partialNote: NoteUpdate): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/notes/${id}/`, partialNote);
  }

  /**
   * Elimina una nota
   * 
   * @param id - ID de la nota a eliminar
   * @returns Observable vacío
   */
  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/notes/${id}/`);
  }

  /**
   * Obtiene todas las notas de un proyecto específico
   * 
   * @param projectId - ID del proyecto
   * @returns Observable con array de notas del proyecto
   */
  getNotesByProject(projectId: number): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/notes/by-project/${projectId}/`);
  }

  /**
   * Obtiene todas las notas de un tipo específico
   * 
   * @param noteType - Tipo de nota (ej: 'meeting', 'research', 'general')
   * @returns Observable con array de notas del tipo especificado
   */
  getNotesByType(noteType: string): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/notes/by-type/${noteType}/`);
  }
}
