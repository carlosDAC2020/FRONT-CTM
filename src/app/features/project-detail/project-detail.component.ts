import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ProjectService } from '../../core/services/project.service';
import { ResearchService } from '../../core/services/research.service';
import { NoteService } from '../../core/services/note.service';
import { Project } from '../../core/models/project.model';
import { ResearchDetail, TaskProgress } from '../../core/models/research.model';
import { Note } from '../../core/models/note.model';

/**
 * Componente de Detalle de Proyecto
 * 
 * Muestra información completa de un proyecto incluyendo:
 * - Detalles del proyecto
 * - Investigaciones realizadas
 * - Oportunidades encontradas
 * - Notas del proyecto
 * - Monitoreo en tiempo real de investigaciones
 */
@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);
  private readonly researchService = inject(ResearchService);
  private readonly noteService = inject(NoteService);

  // Estado del proyecto
  projectId = signal<number | null>(null);
  project = signal<Project | null>(null);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // Estado de investigación
  researchList = signal<ResearchDetail[]>([]);
  currentResearch = signal<ResearchDetail | null>(null);
  isResearching = signal(false);
  researchProgress = signal(0);
  researchStatus = signal('');
  taskSubscription: Subscription | null = null;

  // Estado de notas
  notes = signal<Note[]>([]);

  // Pestaña activa
  activeTab = signal<'opportunities' | 'research' | 'notes'>('opportunities');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectId.set(parseInt(id, 10));
      this.loadProjectData();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy(): void {
    this.taskSubscription?.unsubscribe();
  }

  /**
   * Carga todos los datos del proyecto
   */
  loadProjectData(): void {
    const id = this.projectId();
    if (!id) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    // Cargar proyecto
    this.projectService.getProject(id).subscribe({
      next: (project) => {
        this.project.set(project);
        this.loading.set(false);
        this.loadResearchData();
        this.loadNotes();
      },
      error: (error) => {
        console.error('Error cargando proyecto:', error);
        this.errorMessage.set('Error al cargar el proyecto');
        this.loading.set(false);
      }
    });
  }

  /**
   * Carga las investigaciones del proyecto
   */
  loadResearchData(): void {
    const id = this.projectId();
    if (!id) return;

    this.researchService.getResearchByProject(id).subscribe({
      next: (research) => {
        // Cargar detalles de cada investigación
        if (research.length > 0) {
          this.researchService.getResearch(research[0].id).subscribe({
            next: (detail) => {
              this.currentResearch.set(detail);
              this.researchList.set([detail]);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error cargando investigaciones:', error);
      }
    });
  }

  /**
   * Carga las notas del proyecto
   */
  loadNotes(): void {
    const id = this.projectId();
    if (!id) return;

    this.noteService.getNotesByProject(id).subscribe({
      next: (notes) => {
        this.notes.set(notes);
      },
      error: (error) => {
        console.error('Error cargando notas:', error);
      }
    });
  }

  /**
   * Inicia una nueva investigación
   */
  startResearch(): void {
    const id = this.projectId();
    if (!id || this.isResearching()) return;

    this.isResearching.set(true);
    this.researchProgress.set(0);
    this.researchStatus.set('Iniciando investigación...');

    this.projectService.runResearch(id).subscribe({
      next: (response) => {
        this.monitorResearch(response.task_id);
      },
      error: (error) => {
        console.error('Error iniciando investigación:', error);
        this.isResearching.set(false);
        alert('Error al iniciar la investigación');
      }
    });
  }

  /**
   * Monitorea el progreso de una investigación usando SSE
   */
  monitorResearch(taskId: string): void {
    this.taskSubscription = this.researchService.monitorTask(taskId).subscribe({
      next: (progress: TaskProgress) => {
        this.researchProgress.set(progress.details.progress);
        this.researchStatus.set(progress.details.status);

        if (progress.state === 'SUCCESS') {
          this.isResearching.set(false);
          this.researchStatus.set('¡Investigación completada!');
          setTimeout(() => {
            this.loadResearchData();
          }, 2000);
        } else if (progress.state === 'FAILURE') {
          this.isResearching.set(false);
          this.researchStatus.set('Error en la investigación');
        }
      },
      error: (error) => {
        console.error('Error monitoreando tarea:', error);
        this.isResearching.set(false);
        this.researchStatus.set('Error de conexión');
      }
    });
  }

  /**
   * Cambia la pestaña activa
   */
  setActiveTab(tab: 'opportunities' | 'research' | 'notes'): void {
    this.activeTab.set(tab);
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
   * Vuelve al dashboard
   */
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
