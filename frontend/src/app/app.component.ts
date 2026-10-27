import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header class="nav">
      <a class="brand" routerLink="/"><b>L</b> LearnConnect</a>
      <button class="hamb" (click)="open = !open">☰</button>
      <nav [class.open]="open">
        <a routerLink="/home">Home</a>
        <a routerLink="/courses">Courses</a>
        <a routerLink="/categories">Categories</a>
        <a routerLink="/instructors">Instructors</a>
        <a *ngIf="api.currentUser" routerLink="/my-courses">My Courses</a>
        <a *ngIf="api.currentUser" routerLink="/dashboard">Dashboard</a>
      </nav>
      <div class="navright">
        <ng-container *ngIf="api.currentUser as user; else guest">
          <span>{{ user.name }}</span>
          <button class="btn outline small" (click)="logout()">Log out</button>
        </ng-container>
        <ng-template #guest>
          <a routerLink="/login">Log in</a>
          <a class="btn small" routerLink="/register">Get started</a>
        </ng-template>
      </div>
    </header>

    <main>
      <router-outlet />
    </main>

    <footer>
      <div class="brand"><b>L</b> LearnConnect</div>
      <p>Learn something useful. Build something meaningful.</p>
      <div class="footlinks">
        <a routerLink="/about">About</a>
        <a routerLink="/courses">Courses</a>
        <a routerLink="/contact">Contact</a>
      </div>
      <small>© 2026 LearnConnect · College project demonstration</small>
    </footer>
  `,
})
export class AppComponent {
  api = inject(ApiService);
  open = false;

  logout() {
    this.api.logout();
    location.href = '/home';
  }
}