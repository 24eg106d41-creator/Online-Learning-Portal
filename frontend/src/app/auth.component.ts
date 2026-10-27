import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth">
      <div class="authside">
        <span class="eyebrow">
          {{ mode === 'login' ? 'WELCOME BACK' : 'START SOMETHING NEW' }}
        </span>
        <h1>
          {{ mode === 'login' ? 'Your next idea starts here.' : 'Curiosity is a great place to start.' }}
        </h1>
        <p>Make space for your next skill. Learn at your own pace.</p>
      </div>

      <form class="form authform" (ngSubmit)="submit()">
        <span class="eyebrow">LEARNCONNECT ACCOUNT</span>
        <h2>{{ mode === 'login' ? 'Log in' : 'Create account' }}</h2>
        <label *ngIf="mode === 'register'">
          Full name
          <input name="name" [(ngModel)]="name" required />
        </label>
        <label>
          Email address
          <input type="email" name="email" [(ngModel)]="email" required />
        </label>
        <label>
          Password
          <input type="password" name="password" [(ngModel)]="password" minlength="8" required />
        </label>
        <label *ngIf="mode === 'register'">
          Account type
          <select name="role" [(ngModel)]="role">
            <option value="student">Student</option>
            <option value="instructor">Instructor (demo)</option>
          </select>
        </label>
        <p class="error">{{ error }}</p>
        <button class="btn wide" [disabled]="busy">
          {{ busy ? 'Please wait…' : mode === 'login' ? 'Log in →' : 'Create account →' }}
        </button>
        <p class="switch" *ngIf="mode === 'login'">
          New to LearnConnect? <a routerLink="/register">Create an account</a>
        </p>
        <p class="switch" *ngIf="mode === 'register'">
          Already registered? <a routerLink="/login">Log in</a>
        </p>
        <small *ngIf="mode === 'register'">
          Instructor role selection is for demonstration only.
        </small>
      </form>
    </section>
  `,
})
export class AuthComponent {
  private api = inject(ApiService);
  mode = 'login';
  name = '';
  email = '';
  password = '';
  role = 'student';
  error = '';
  busy = false;

  constructor() {
    inject(ActivatedRoute).data.subscribe((data) => {
      this.mode = data['mode'] || 'login';
    });
  }

  submit() {
    this.busy = true;
    this.error = '';

    const request =
      this.mode === 'login'
        ? this.api.login({ email: this.email, password: this.password })
        : this.api.register({
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role,
          });

    request.subscribe({
      next: () => (location.href = '/dashboard'),
      error: (error) => {
        this.error = error.error?.message || 'Request failed.';
        this.busy = false;
      },
    });
  }
}
