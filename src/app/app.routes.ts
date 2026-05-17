import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'peliculas',
    pathMatch: 'full',
  },
  {
    path: 'peliculas',
    loadComponent: () => import('./pages/peliculas/peliculas.page').then( m => m.PeliculasPage)
  },
  {
    path: 'pelicula-form',
    loadComponent: () => import('./pages/pelicula-form/pelicula-form.page').then( m => m.PeliculaFormPage)
  },
  {
    path: 'pelicula-form/:id',
    loadComponent: () => import('./pages/pelicula-form/pelicula-form.page').then( m => m.PeliculaFormPage)
  },
  {
    path: 'pelicula/:id',
    loadComponent: () => import('./pages/pelicula/pelicula.page').then( m => m.PeliculaPage)
  },
];
