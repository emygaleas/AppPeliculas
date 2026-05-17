import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonButton,
  IonMenu,
  IonMenuButton,
  IonItem,
  IonButtons,
} from '@ionic/angular/standalone';
import { Pelicula, PeliculasService } from 'src/app/services/peliculas';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.page.html',
  styleUrls: ['./peliculas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonButton,
    IonMenu,
    IonMenuButton,
    IonItem,
    IonButtons,
  ],
})
export class PeliculasPage implements OnInit {
  peliculas: Pelicula[] = [];
  constructor(private peliculasService: PeliculasService) {}

  ngOnInit() {
    this.cargar();
  }

  ionViewWillEnter() {
    this.cargar();
  }

  async cargar() {
    this.peliculas = await this.peliculasService.listar();
  }

  generoSeleccionado: string = '';

  peliculasFiltradas() {
    if (!this.generoSeleccionado) {
      return this.peliculas;
    }

    return this.peliculas.filter(
      (pelicula) => pelicula.genero === this.generoSeleccionado,
    );
  }
}
