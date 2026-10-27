import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, Course } from './api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="pagehero">
      <span class="eyebrow">EXPLORE & GROW</span>
      <h1>Courses for your <em>next step.</em></h1>
      <p>Choose a topic, learn at your pace, and build skills that matter.</p>
    </section>

    <section class="section">
      <div class="filters">
        <input
          [(ngModel)]="search"
          (ngModelChange)="filter()"
          placeholder="Search courses, skills, instructors…"
        />
        <select [(ngModel)]="category" (ngModelChange)="filter()">
          <option value="">All categories</option>
          <option *ngFor="let category of categories" [value]="category.name">
            {{ category.name }}
          </option>
        </select>
        <select [(ngModel)]="level" (ngModelChange)="filter()">
          <option value="">All levels</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      <p class="error">{{ error }}</p>

      <div class="grid">
        <article class="course" *ngFor="let course of filtered">
          <img [src]="course.thumbnail" [alt]="course.title" />
          <div class="pad">
            <span class="tag">{{ course.category }}</span>
            <span class="rating">★ {{ course.rating || 'New' }}</span>
            <h3>{{ course.title }}</h3>
            <p>{{ course.description }}</p>
            <div class="bottom">
              <span>{{ course.duration }} · {{ course.level }}</span>
              <a [routerLink]="['/courses', course.id]">Details →</a>
            </div>
            <div class="bottom">
              <b>{{ course.price ? '₹' + course.price : 'Free' }}</b>
              <span>{{ course.students }} learners</span>
            </div>
          </div>
        </article>
      </div>

      <div class="empty" *ngIf="!filtered.length">
        <h2>No courses found</h2>
        <button class="btn ghost" (click)="reset()">Clear filters</button>
      </div>
    </section>
  `,
})
export class CoursesComponent {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  all: Course[] = [];
  filtered: Course[] = [];
  categories: any[] = [];
  search = '';
  category = '';
  level = '';
  error = '';

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      this.category = params.get('category') || '';
      this.filter();
    });

    this.api.categories().subscribe({
      next: (categories) => (this.categories = categories),
      error: () => {},
    });

    this.api.courses().subscribe({
      next: (courses) => {
        this.all = courses;
        this.filter();
      },
      error: () => (this.error = 'Unable to load courses. Check backend.'),
    });
  }

  filter() {
    const searchTerm = this.search.toLowerCase();

    this.filtered = this.all.filter((course) => {
      const matchesSearch =
        !searchTerm ||
        `${course.title} ${course.description} ${course.instructorName}`
          .toLowerCase()
          .includes(searchTerm);
      const matchesCategory = !this.category || course.category === this.category;
      const matchesLevel = !this.level || course.level === this.level;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }

  reset() {
    this.search = '';
    this.category = '';
    this.level = '';
    this.filter();
  }
}
