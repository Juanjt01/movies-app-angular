import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { MovieListComponent } from './features/movies/movie-list/movie-list.component';
import { MovieCreateComponent } from './features/movies/movie-create/movie-create.component';
import { MovieDetailComponent } from './features/movies/movie-detail/movie-detail.component';
import { MovieEditComponent } from './features/movies/movie-edit/movie-edit.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'movies', 
    component: MovieListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'movies/create', 
    component: MovieCreateComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'movies/:id/edit', 
    component: MovieEditComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'movies/:id', 
    component: MovieDetailComponent,
    canActivate: [authGuard]
  }
];