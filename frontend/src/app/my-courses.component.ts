import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="pagehero">
      <span class="eyebrow">YOUR PROGRESS</span>
      <h1>My <em>courses.</em></h1>
      <p>Your learning, gathered in one place.</p>
    </section>

    <section class="section">
      <p class="error">{{ error }}</p>

      <div class="grid">
        <article class="course" *ngFor="let enrollment of items">
          <img
            [src]="enrollment.course.thumbnail"
            [alt]="enrollment.course.title"
          />
          <div class="pad">
            <span class="tag">{{ enrollment.course.category }}</span>
            <h3>{{ enrollment.course.title }}</h3>
            <p>{{ enrollment.course.instructorName }} · {{ enrollment.course.duration }}</p>
            <div class="progress">
              <i [style.width.%]="enrollment.progress"></i>
            </div>
            <div class="bottom">
              <span>{{ enrollment.progress }}% complete</span>
              <a [routerLink]="['/courses', enrollment.course.id]">Continue →</a>
            </div>
          </div>
        </article>
      </div>

      <div class="empty" *ngIf="!items.length && !error">
        <h2>Your learning journey starts here.</h2>
        <p>You have not enrolled in a course yet.</p>
        <a class="btn" routerLink="/courses">Explore courses →</a>
      </div>
    </section>
  `,
})
export class MyCoursesComponent {
  private api = inject(ApiService);
  items: any[] = [];
  error = '';

  constructor() {
    if (!this.api.currentUser) {
      location.href = '/login';
      return;
    }

    this.api.myCourses().subscribe({
      next: (enrollments) => (this.items = enrollments),
      error: (error) => {
        this.error = error.error?.message || 'Unable to load courses.';
      },
    });
  }
}
