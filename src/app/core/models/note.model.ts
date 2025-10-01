/**
 * Modelo de Nota
 * Representa una nota asociada a un proyecto
 */
export interface Note {
  id?: number;
  project: number;
  project_title?: string;
  date?: string;
  title: string;
  content: string;
  type: string;
}

/**
 * Datos para crear una nota
 */
export interface NoteCreate {
  project: number;
  title: string;
  content: string;
  type: string;
}

/**
 * Datos para actualizar una nota (parcial)
 */
export interface NoteUpdate {
  title?: string;
  content?: string;
  type?: string;
}
