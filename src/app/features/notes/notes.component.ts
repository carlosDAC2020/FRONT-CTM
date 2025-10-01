import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NoteService } from '../../core/services/note.service';
import { ProjectService } from '../../core/services/project.service';
import { Note, NoteCreate } from '../../core/models/note.model';
import { Project } from '../../core/models/project.model';

/**
 * Componente de Notas
 * 
 * Permite visualizar, crear, editar y eliminar notas
 * asociadas a los proyectos del usuario.
 */
@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent implements OnInit {
  private readonly noteService = inject(NoteService);
  private readonly projectService = inject(ProjectService);

  // Estado
  notes = signal<Note[]>([]);
  projects = signal<Project[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // Modal
  showModal = signal(false);
  modalLoading = signal(false);
  editingNote = signal<Note | null>(null);

  // Formulario
  noteForm = signal<NoteCreate>({
    project: 0,
    title: '',
    content: '',
    type: 'general'
  });

  ngOnInit(): void {
    this.loadNotes();
    this.loadProjects();
  }

  /**
   * Carga todas las notas del usuario
   */
  loadNotes(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.noteService.getNotes().subscribe({
      next: (notes) => {
        this.notes.set(notes);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando notas:', error);
        this.errorMessage.set('Error al cargar las notas');
        this.loading.set(false);
      }
    });
  }

  /**
   * Carga los proyectos para el selector
   */
  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
      },
      error: (error) => {
        console.error('Error cargando proyectos:', error);
      }
    });
  }

  /**
   * Abre el modal para crear una nueva nota
   */
  openCreateModal(): void {
    this.editingNote.set(null);
    this.noteForm.set({
      project: this.projects()[0]?.id || 0,
      title: '',
      content: '',
      type: 'general'
    });
    this.showModal.set(true);
  }

  /**
   * Abre el modal para editar una nota existente
   */
  openEditModal(note: Note): void {
    this.editingNote.set(note);
    this.noteForm.set({
      project: note.project,
      title: note.title,
      content: note.content,
      type: note.type
    });
    this.showModal.set(true);
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.showModal.set(false);
    this.editingNote.set(null);
  }

  /**
   * Actualiza un campo del formulario
   */
  updateField(field: keyof NoteCreate, value: string | number): void {
    this.noteForm.update(form => ({ ...form, [field]: value }));
  }

  /**
   * Guarda la nota (crear o actualizar)
   */
  saveNote(): void {
    this.modalLoading.set(true);

    const editing = this.editingNote();
    
    if (editing) {
      // Actualizar nota existente
      this.noteService.updateNote(editing.id!, this.noteForm()).subscribe({
        next: () => {
          this.modalLoading.set(false);
          this.closeModal();
          this.loadNotes();
        },
        error: (error) => {
          console.error('Error actualizando nota:', error);
          this.modalLoading.set(false);
          alert('Error al actualizar la nota');
        }
      });
    } else {
      // Crear nueva nota
      this.noteService.createNote(this.noteForm()).subscribe({
        next: () => {
          this.modalLoading.set(false);
          this.closeModal();
          this.loadNotes();
        },
        error: (error) => {
          console.error('Error creando nota:', error);
          this.modalLoading.set(false);
          alert('Error al crear la nota');
        }
      });
    }
  }

  /**
   * Elimina una nota
   */
  deleteNote(note: Note): void {
    if (!confirm(`¿Estás seguro de eliminar la nota "${note.title}"?`)) {
      return;
    }

    this.noteService.deleteNote(note.id!).subscribe({
      next: () => {
        this.loadNotes();
      },
      error: (error) => {
        console.error('Error eliminando nota:', error);
        alert('Error al eliminar la nota');
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
}
