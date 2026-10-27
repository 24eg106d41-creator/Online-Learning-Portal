import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Course } from './api.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <ng-container *ngIf="page === 'Home'; else other">
      <section class="hero">
        <div>
          <span class="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
          <h1>Learn new skills.<br /><em>Build your future.</em></h1>
          <p>
            Discover expert-led courses, develop practical skills, and move confidently toward your
            goals.
          </p>
          <a class="btn" routerLink="/courses">Explore courses →</a>
          <a class="btn ghost" routerLink="/about">Discover LearnConnect</a>
          <div class="proof">✦ Flexible learning · Practical skills · Your own pace</div>
        </div>

        <div class="hero-art">
          <div class="artbox">
            <span>✦</span>
            <small>YOUR LEARNING SPACE</small>
            <h2>Make today<br />count.</h2>
            <div class="progress"><i></i></div>
            <small>One lesson at a time</small>
          </div>
          <div class="bubble">Curiosity looks good on you.</div>
        </div>
      </section>

      <section class="stats">
        <div><b>Flexible</b><span>Learn on your schedule</span></div>
        <div><b>Practical</b><span>Skills you can use</span></div>
        <div><b>Connected</b><span>Learn with a community</span></div>
        <div><b>Curious</b><span>Always room to grow</span></div>
      </section>

      <section class="section">
        <div class="sectionhead">
          <div>
            <span class="eyebrow">A PLACE TO BEGIN</span>
            <h2>Find your next <em>big thing.</em></h2>
            <p>Explore popular courses designed to help you move forward.</p>
          </div>
          <a class="link" routerLink="/courses">View all courses ↗</a>
        </div>

        <p *ngIf="error" class="error">{{ error }}</p>
        <div class="grid">
          <article class="course" *ngFor="let course of courses">
            <img [src]="course.thumbnail" [alt]="course.title" />
            <div class="pad">
              <span class="tag">{{ course.category }}</span>
              <span class="rating">★ {{ course.rating }}</span>
              <h3>{{ course.title }}</h3>
              <p>{{ course.description }}</p>
              <div class="bottom">
                <span>{{ course.duration }} · {{ course.level }}</span>
                <a [routerLink]="['/courses', course.id]">Explore →</a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="cta">
        <div>
          <span class="eyebrow">YOUR JOURNEY, YOUR WAY</span>
          <h2>Small steps can lead to <em>remarkable things.</em></h2>
          <p>Choose a topic that sparks your interest and start learning today.</p>
        </div>
        <a class="btn white" routerLink="/register">Start learning free ↗</a>
      </section>
    </ng-container>

    <ng-template #other>
      <section class="pagehero">
        <span class="eyebrow">LEARNCONNECT</span>
        <h1>{{ page }}</h1>
        <p>{{ desc }}</p>
      </section>

      <section class="section" *ngIf="page === 'About'">
        <div class="panel">
          <h2>Learning should open doors.</h2>
          <p>
            LearnConnect is an online learning portal designed to make skill-building clear,
            flexible and approachable. Students can discover courses, enroll, and organize their
            learning. Instructors can share knowledge and manage courses.
          </p>
          <div class="three">
            <div>
              <b>01</b>
              <h3>Accessible</h3>
              <p>A simple experience across devices.</p>
            </div>
            <div>
              <b>02</b>
              <h3>Practical</h3>
              <p>Topics focused on useful skills.</p>
            </div>
            <div>
              <b>03</b>
              <h3>Progress-led</h3>
              <p>Keep your journey organized.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section" *ngIf="page === 'Categories'">
        <div class="grid four">
          <a
            class="category"
            *ngFor="let category of categories"
            [routerLink]="['/courses']"
            [queryParams]="{ category: category.name }"
          >
            <b>✳ {{ category.name }}</b>
            <p>{{ category.count }} course(s)</p>
            <span class="link">Explore →</span>
          </a>
        </div>
      </section>

      <section class="section" *ngIf="page === 'Instructors'">
        <div class="grid four">
          <div class="category" *ngFor="let instructor of instructors">
            <div class="avatar">{{ instructor.name.slice(0, 1) }}</div>
            <h3>{{ instructor.name }}</h3>
            <p>{{ instructor.courses }} course(s)</p>
          </div>
        </div>
      </section>

      <section class="section" *ngIf="page === 'Contact'">
        <form class="form" (ngSubmit)="send()">
          <label>
            Your name
            <input name="name" [(ngModel)]="contact.name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" [(ngModel)]="contact.email" required />
          </label>
          <label>
            Message
            <textarea name="message" [(ngModel)]="contact.message" required></textarea>
          </label>
          <button class="btn">Send message →</button>
          <p class="success">{{ notice }}</p>
          <p class="error">{{ error }}</p>
        </form>
      </section>

      <section
        class="section"
        *ngIf="!['About', 'Categories', 'Instructors', 'Contact'].includes(page)"
      >
        <div class="empty">
          <h2>{{ page }} workspace</h2>
          <p>
            This route is included in the project structure and can be extended. Course browsing,
            accounts, enrollment, profile and instructor course creation are available in this
            starter.
          </p>
          <a class="btn" routerLink="/courses">Explore courses</a>
        </div>
      </section>
    </ng-template>
  `,
})
export class PageComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);

  page = 'Home';
  desc = 'Discover learning opportunities.';
  courses: Course[] = [];
  categories: any[] = [];
  instructors: any[] = [];
  error = '';
  notice = '';
  contact = { name: '', email: '', message: '' };

  constructor() {
    this.route.data.subscribe((data) => {
      this.page = data['page'] || 'Home';
      this.desc =
        this.page === 'Contact'
          ? 'Have a question? Send a message to the LearnConnect team.'
          : `Discover what LearnConnect can help you do with ${this.page.toLowerCase()}.`;
    });

    this.api.courses().subscribe({
      next: (courses) => (this.courses = courses.slice(0, 3)),
      error: () => (this.error = 'Start the backend server to load courses.'),
    });

    this.api.categories().subscribe({
      next: (categories) => (this.categories = categories),
      error: () => {},
    });

    this.api.instructors().subscribe({
      next: (instructors) => (this.instructors = instructors),
      error: () => {},
    });
  }

  send() {
    this.api.contact(this.contact).subscribe({
      next: (response) => {
        this.notice = response.message;
        this.error = '';
        this.contact = { name: '', email: '', message: '' };
      },
      error: (error) => {
        this.error = error.error?.message || 'Unable to send message.';
      },
    });
  }
}
