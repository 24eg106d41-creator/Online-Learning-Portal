import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, Course } from './api.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="section">
      <a class="link" routerLink="/courses">← All courses</a>
      <p class="error">{{ error }}</p>

      <div class="detail" *ngIf="course">
        <div>
          <span class="tag">{{ course.category }}</span>
          <h1>{{ course.title }}</h1>
          <p>{{ course.description }}</p>
          <div class="facts">
            <span>◷ {{ course.duration }}</span>
            <span>◈ {{ course.level }}</span>
            <span>★ {{ course.rating || 'New' }}</span>
            <span>♧ {{ course.students }} learners</span>
          </div>
          <h2>What you'll learn</h2>
          <ul>
            <li>Understand core concepts and key terminology.</li>
            <li>Apply knowledge through guided practice.</li>
            <li>Build confidence with practical learning steps.</li>
          </ul>
          <h2>Instructor</h2>
          <p>{{ course.instructorName }} · LearnConnect instructor</p>
        </div>

        <aside class="detailcard">
          <img [src]="course.thumbnail" [alt]="course.title" />
          <div class="pad">
            <h2>{{ course.price ? '₹' + course.price : 'Free' }}</h2>
            <p>{{ course.lessons }} lessons · Self-paced</p>
            <button class="btn wide" (click)="enroll()">Enroll now →</button>
            <p class="success">{{ message }}</p>
            <p class="error">{{ actionError }}</p>
            <a class="link" routerLink="/my-courses">My courses</a>
          </div>
        </aside>
      </div>
    </section>
  `,
})
export class DetailComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);

  course: Course | null = null;
  error = '';
  message = '';
  actionError = '';

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.api.course(params.get('id') || '').subscribe({
        next: (course) => (this.course = course),
        error: (error) => {
          this.error = error.error?.message || 'Unable to load course.';
        },
      });
    });
  }

  enroll() {
    if (!this.api.currentUser) {
      location.href = '/login';
      return;
    }

    if (this.api.currentUser.role !== 'student') {
      this.actionError = 'Only student accounts can enroll.';
      return;
    }

    if (this.course) {
      this.api.enroll(this.course.id).subscribe({
        next: () => {
          this.message = 'Enrolled successfully! Open My Courses.';
          this.actionError = '';
        },
        error: (error) => {
          this.actionError = error.error?.message || 'Enrollment failed.';
        },
      });
    }
  }
}
