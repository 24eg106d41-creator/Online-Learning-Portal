import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, Course } from './api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="section">
      <span class="eyebrow">INSTRUCTOR STUDIO</span>
      <h1>Course <em>management.</em></h1>
      <p>Create a course to share your knowledge.</p>

      <p class="error" *ngIf="api.currentUser?.role !== 'instructor'">
        Instructor accounts only. <a routerLink="/register">Create demo instructor account</a>.
      </p>

      <form
        class="form profileform"
        *ngIf="api.currentUser?.role === 'instructor'"
        (ngSubmit)="create()"
      >
        <h2>Create a course</h2>
        <label>
          Course title
          <input name="title" [(ngModel)]="form.title" required />
        </label>
        <label>
          Description
          <textarea name="description" [(ngModel)]="form.description" required></textarea>
        </label>
        <label>
          Category
          <input name="category" [(ngModel)]="form.category" required />
        </label>
        <div class="row">
          <label>
            Level
            <select name="level" [(ngModel)]="form.level">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
          <label>
            Duration
            <input name="duration" [(ngModel)]="form.duration" />
          </label>
        </div>
        <p class="success">{{ message }}</p>
        <p class="error">{{ error }}</p>
        <button class="btn">Publish course →</button>
      </form>

      <div class="panel" *ngIf="api.currentUser?.role === 'instructor'">
        <h2>Your courses</h2>
        <p *ngFor="let course of courses">{{ course.title }} · {{ course.category }}</p>
      </div>
    </section>
  `,
})
export class ManageComponent {
  api = inject(ApiService);
  form = this.createEmptyCourseForm();
  courses: Course[] = [];
  message = '';
  error = '';

  constructor() {
    this.load();
  }

  private createEmptyCourseForm() {
    return {
      title: '',
      description: '',
      category: 'Web Development',
      level: 'Beginner',
      duration: '4 weeks',
    };
  }

  load() {
    this.api.courses().subscribe({
      next: (courses) => {
        this.courses = courses.filter(
          (course) => course.instructorId === this.api.currentUser?.id
        );
      },
      error: () => {},
    });
  }

  create() {
    this.api.createCourse(this.form).subscribe({
      next: (course) => {
        this.message = `${course.title} published successfully.`;
        this.form = this.createEmptyCourseForm();
        this.load();
      },
      error: (error) => {
        this.error = error.error?.message || 'Unable to publish course.';
      },
    });
  }
}
