import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ResearchService } from '../../core/services/research.service';
import { ResearchSummary } from '../../core/models/research.model';

/**
 * Componente de Investigaciones
 * 
 * Muestra un listado de todas las investigaciones realizadas
 * con sus métricas y estado de ejecución.
 */
@Component({
  selector: 'app-research',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './research.component.html',
  styleUrl: './research.component.css'
})
export class ResearchComponent implements OnInit {
  private readonly researchService = inject(ResearchService);
  private readonly router = inject(Router);

  // Estado
  researchList = signal<ResearchSummary[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadResearch();
  }

  /**
   * Carga todas las investigaciones del usuario
   */
  loadResearch(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.researchService.getResearchList().subscribe({
      next: (research) => {
        this.researchList.set(research);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando investigaciones:', error);
        this.errorMessage.set('Error al cargar las investigaciones');
        this.loading.set(false);
      }
    });
  }

  /**
   * Formatea una fecha
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Obtiene la clase CSS según el estado
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'status-success';
      case 'FAILURE':
        return 'status-failure';
      case 'PROGRESS':
        return 'status-progress';
      default:
        return 'status-pending';
    }
  }

  /**
   * Obtiene el texto del estado en español
   */
  getStatusText(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'Completado';
      case 'FAILURE':
        return 'Fallido';
      case 'PROGRESS':
        return 'En Progreso';
      case 'PENDING':
        return 'Pendiente';
      default:
        return status;
    }
  }
}
