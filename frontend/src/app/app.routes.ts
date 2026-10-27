import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { CoursesComponent } from './courses.component';
import { DetailComponent } from './detail.component';
import { AuthComponent } from './auth.component';
import { DashboardComponent } from './dashboard.component';
import { MyCoursesComponent } from './my-courses.component';
import { ProfileComponent } from './profile.component';
import { ManageComponent } from './manage.component';

export const routes: Routes = [
  { path: '', component: PageComponent, data: { page: 'Home' } },
  { path: 'home', component: PageComponent, data: { page: 'Home' } },
  { path: 'about', component: PageComponent, data: { page: 'About' } },
  { path: 'contact', component: PageComponent, data: { page: 'Contact' } },
  { path: 'categories', component: PageComponent, data: { page: 'Categories' } },
  { path: 'instructors', component: PageComponent, data: { page: 'Instructors' } },
  { path: 'courses', component: CoursesComponent },
  { path: 'courses/:id', component: DetailComponent },
  { path: 'login', component: AuthComponent, data: { mode: 'login' } },
  { path: 'register', component: AuthComponent, data: { mode: 'register' } },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'instructor-dashboard', component: DashboardComponent },
  { path: 'my-courses', component: MyCoursesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'course-management', component: ManageComponent },
  { path: 'my-learning', component: PageComponent, data: { page: 'My Learning' } },
  { path: 'learning-materials', component: PageComponent, data: { page: 'Learning Materials' } },
  { path: 'assignments', component: PageComponent, data: { page: 'Assignments' } },
  { path: 'quizzes', component: PageComponent, data: { page: 'Quizzes' } },
  { path: 'certificates', component: PageComponent, data: { page: 'Certificates' } },
  { path: '**', redirectTo: '' },
];