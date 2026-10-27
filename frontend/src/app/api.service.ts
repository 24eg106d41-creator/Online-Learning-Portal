import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructorId: string;
  instructorName: string;
  duration: string;
  level: string;
  price: number;
  rating: number;
  students: number;
  lessons: number;
  thumbnail: string;
  published: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  phone?: string;
  bio?: string;
}

const API = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private subject = new BehaviorSubject<User | null>(this.readUser());

  user$ = this.subject.asObservable();

  get currentUser() {
    return this.subject.value;
  }

  private readUser(): User | null {
    try {
      const savedUser = localStorage.getItem('lc_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  }

  courses() {
    return this.http.get<Course[]>(`${API}/courses`);
  }

  course(id: string) {
    return this.http.get<Course>(`${API}/courses/${id}`);
  }

  categories() {
    return this.http.get<any[]>(`${API}/categories`);
  }

  instructors() {
    return this.http.get<any[]>(`${API}/instructors`);
  }

  private save(response: { token: string; user: User }) {
    localStorage.setItem('lc_token', response.token);
    localStorage.setItem('lc_user', JSON.stringify(response.user));
    this.subject.next(response.user);
  }

  register(data: { name: string; email: string; password: string; role: string }) {
    return this.http
      .post<any>(`${API}/auth/register`, data)
      .pipe(tap((response) => this.save(response)));
  }

  login(data: { email: string; password: string }) {
    return this.http
      .post<any>(`${API}/auth/login`, data)
      .pipe(tap((response) => this.save(response)));
  }

  logout() {
    localStorage.removeItem('lc_token');
    localStorage.removeItem('lc_user');
    this.subject.next(null);
  }

  enroll(courseId: string) {
    return this.http.post<any>(`${API}/enrollments`, { courseId });
  }

  myCourses() {
    return this.http.get<any[]>(`${API}/enrollments/my-courses`);
  }

  profile() {
    return this.http.get<User>(`${API}/profile`);
  }

  updateProfile(data: any) {
    return this.http.put<User>(`${API}/profile`, data).pipe(
      tap((user) => {
        const updatedUser = { ...this.currentUser, ...user } as User;
        localStorage.setItem('lc_user', JSON.stringify(updatedUser));
        this.subject.next(updatedUser);
      })
    );
  }

  instructorDashboard() {
    return this.http.get<any>(`${API}/instructor/dashboard`);
  }

  createCourse(data: any) {
    return this.http.post<Course>(`${API}/courses`, data);
  }

  contact(data: any) {
    return this.http.post<any>(`${API}/contact`, data);
  }
}
