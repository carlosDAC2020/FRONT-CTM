import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ProjectService } from '../../core/services/project.service';
import { Project, ProjectCreate } from '../../core/models/project.model';

/**
 * Componente Dashboard
 * 
 * Vista principal de la aplicación que muestra:
 * - Lista de proyectos del usuario
 * - Modal para crear nuevos proyectos
 * - Navegación a detalles de proyecto
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);

  // Estado de proyectos
  projects = signal<Project[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // Estado del modal
  showModal = signal(false);
  modalLoading = signal(false);

  // Formulario de nuevo proyecto
  newProject = signal<ProjectCreate>({
    title: '',
    description: '',
    keywords: []
  });
  keywordsInput = signal('');

  ngOnInit(): void {
    this.loadProjects();
  }

  /**
   * Carga la lista de proyectos del usuario
   */
  loadProjects(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando proyectos:', error);
        this.errorMessage.set('Error al cargar los proyectos');
        this.loading.set(false);
      }
    });
  }

  /**
   * Abre el modal de creación de proyecto
   */
  openCreateModal(): void {
    this.showModal.set(true);
    this.resetForm();
  }

  /**
   * Cierra el modal de creación de proyecto
   */
  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
  }

  /**
   * Resetea el formulario de creación
   */
  resetForm(): void {
    this.newProject.set({
      title: '',
      description: '',
      keywords: []
    });
    this.keywordsInput.set('');
  }

  /**
   * Actualiza un campo del formulario
   */
  updateField(field: keyof ProjectCreate, value: string): void {
    this.newProject.update(project => ({ ...project, [field]: value }));
  }

  /**
   * Actualiza el input de keywords
   */
  updateKeywordsInput(value: string): void {
    this.keywordsInput.set(value);
  }

  /**
   * Procesa las keywords del input y las convierte en array
   */
  processKeywords(): string[] {
    return this.keywordsInput()
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
  }

  /**
   * Crea un nuevo proyecto
   */
  createProject(): void {
    this.modalLoading.set(true);

    const projectData: ProjectCreate = {
      ...this.newProject(),
      keywords: this.processKeywords()
    };

    this.projectService.createProject(projectData).subscribe({
      next: (project) => {
        this.modalLoading.set(false);
        this.closeModal();
        this.loadProjects();
      },
      error: (error) => {
        console.error('Error creando proyecto:', error);
        this.modalLoading.set(false);
        alert('Error al crear el proyecto. Por favor, intenta nuevamente.');
      }
    });
  }

  /**
   * Navega a los detalles de un proyecto
   */
  goToProject(projectId: number): void {
    this.router.navigate(['/project', projectId]);
  }

  /**
   * Formatea la fecha de creación
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
