/**
 * Modelo de Proyecto
 * Representa un proyecto de investigación de oportunidades
 */
export interface Project {
  id?: number;
  title: string;
  description: string;
  keywords: string[];
  created_at?: string;
  user?: number;
}

/**
 * Datos para crear o actualizar un proyecto
 */
export interface ProjectCreate {
  title: string;
  description: string;
  keywords: string[];
}

/**
 * Respuesta al iniciar una investigación
 */
export interface ResearchStartResponse {
  status: string;
  task_id: string;
}
