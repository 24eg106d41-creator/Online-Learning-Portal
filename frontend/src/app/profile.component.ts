import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="section">
      <span class="eyebrow">YOUR ACCOUNT</span>
      <h1>My <em>profile.</em></h1>

      <form class="form profileform" (ngSubmit)="save()">
        <label>
          Full name
          <input name="name" [(ngModel)]="form.name" required />
        </label>
        <label>
          Email
          <input [value]="email" disabled />
        </label>
        <label>
          Phone
          <input name="phone" [(ngModel)]="form.phone" />
        </label>
        <label>
          Short bio
          <textarea name="bio" [(ngModel)]="form.bio" rows="4"></textarea>
        </label>
        <p class="success">{{ message }}</p>
        <p class="error">{{ error }}</p>
        <button class="btn">Save changes →</button>
      </form>
    </section>
  `,
})
export class ProfileComponent {
  private api = inject(ApiService);
  form = { name: '', phone: '', bio: '' };
  email = '';
  message = '';
  error = '';

  constructor() {
    if (!this.api.currentUser) {
      location.href = '/login';
      return;
    }

    this.api.profile().subscribe({
      next: (user) => {
        this.form = {
          name: user.name,
          phone: user.phone || '',
          bio: user.bio || '',
        };
        this.email = user.email;
      },
      error: (error) => {
        this.error = error.error?.message || 'Unable to load profile.';
      },
    });
  }

  save() {
    this.api.updateProfile(this.form).subscribe({
      next: () => (this.message = 'Profile updated successfully.'),
      error: (error) => {
        this.error = error.error?.message || 'Unable to save profile.';
      },
    });
  }
}
