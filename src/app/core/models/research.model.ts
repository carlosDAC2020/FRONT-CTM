import { Project } from './project.model';

/**
 * Estado de ejecución de una investigación
 */
export type ResearchStatus = 'PENDING' | 'PROGRESS' | 'COMPLETED' | 'FAILURE';

/**
 * Contexto de búsqueda encontrado durante la investigación
 */
export interface SearchContext {
  id: number;
  title: string;
  description: string;
  url: string;
  is_relevant: boolean;
}

/**
 * Oportunidad de financiamiento encontrada
 */
export interface Opportunity {
  id: number;
  origin: string;
  description: string;
  financing: string;
  requirements: string[];
  deadline: string;
  url_to: string;
  type: string;
  source_context?: SearchContext;
}

/**
 * Reporte generado de la investigación
 */
export interface Report {
  id: number;
  date: string;
  path: string;
}

/**
 * Resumen de investigación (para listados)
 */
export interface ResearchSummary {
  id: number;
  project_title: string;
  date: string;
  status: ResearchStatus;
  execute_time: number;
  initial_results_count: number;
  relevant_results_count: number;
  opportunities_found_count: number;
  relevance_ratio: number;
  opportunity_ratio: number;
  opportunities_count: number;
}

/**
 * Detalle completo de una investigación
 */
export interface ResearchDetail {
  id: number;
  project: Project;
  execute_time: number;
  date: string;
  status: ResearchStatus;
  initial_results_count: number;
  relevant_results_count: number;
  opportunities_found_count: number;
  relevance_ratio: number;
  opportunity_ratio: number;
  opportunities: Opportunity[];
  contexts: SearchContext[];
  report?: Report;
}

/**
 * Actualización de progreso de tarea (SSE)
 */
export interface TaskProgress {
  state: 'PENDING' | 'PROGRESS' | 'SUCCESS' | 'FAILURE';
  details: {
    status: string;
    progress: number;
    step_results?: StepResult[];
    final_result?: any;
  };
}

/**
 * Resultado de un paso en el flujo de IA
 */
export interface StepResult {
  type: 'log' | 'tool_result';
  message?: string;
  step_name?: string;
  tool?: string;
  data?: any;
}
