import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../core/services/task.service';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})

export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle = '';

  loading = false;
  error: string | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.loading = true;
    this.error = null;

    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar las tareas';
        this.loading = false;
      },
    });
  }

  addTask(): void {
    const title = this.newTaskTitle.trim();
    if (!title) return;

    const newTask: Task = { title, completed: false };
    this.taskService.addTask(newTask).subscribe({
      next: (created) => {
        this.tasks.push(created);
        this.newTaskTitle = '';
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo agregar la tarea';
      },
    });
  }

  toggleTask(task: Task): void {
    const updated: Task = { ...task, completed: !task.completed };
    this.taskService.updateTask(updated).subscribe({
      next: () => (task.completed = updated.completed),
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo actualizar la tarea';
      },
    });
  }

  deleteTask(task: Task): void {
    if (task.id == null) return;
    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((t) => t.id !== task.id);
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo eliminar la tarea';
      },
    });
  }
}