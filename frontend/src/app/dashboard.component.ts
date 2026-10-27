import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="section">
      <span class="eyebrow">YOUR LEARNING SPACE</span>
      <h1>Hello, <em>{{ api.currentUser?.name || 'learner' }}</em></h1>
      <p>A little progress each day adds up to big results.</p>

      <div class="grid dash">
        <a class="category" routerLink="/my-courses">
          <h3>▣ My Courses</h3>
          <p>Continue your enrolled learning.</p>
          <span class="link">Open courses →</span>
        </a>
        <a class="category" routerLink="/courses">
          <h3>⌕ Discover</h3>
          <p>Find your next topic to explore.</p>
          <span class="link">Browse courses →</span>
        </a>
        <a class="category" routerLink="/profile">
          <h3>◎ My Profile</h3>
          <p>Keep your account information current.</p>
          <span class="link">Edit profile →</span>
        </a>
        <a
          class="category"
          *ngIf="api.currentUser?.role === 'instructor'"
          routerLink="/course-management"
        >
          <h3>✎ Course management</h3>
          <p>Create and manage your courses.</p>
          <span class="link">Manage →</span>
        </a>
      </div>

      <div class="panel" *ngIf="stats">
        <h2>Instructor overview</h2>
        <p>
          Total courses: {{ stats.totalCourses }} · Published: {{ stats.publishedCourses }} ·
          Students: {{ stats.totalStudents }}
        </p>
      </div>
      <p class="error">{{ error }}</p>
    </section>
  `,
})
export class DashboardComponent {
  api = inject(ApiService);
  stats: any = null;
  error = '';

  constructor() {
    if (!this.api.currentUser) {
      location.href = '/login';
      return;
    }

    if (this.api.currentUser.role === 'instructor') {
      this.api.instructorDashboard().subscribe({
        next: (stats) => (this.stats = stats),
        error: (error) => {
          this.error = error.error?.message || 'Unable to load dashboard.';
        },
      });
    }
  }
}
