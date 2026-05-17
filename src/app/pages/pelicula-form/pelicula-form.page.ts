import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonTextarea,
  IonGrid,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Pelicula, PeliculasService } from 'src/app/services/peliculas';
import { ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-pelicula-form',
  templateUrl: './pelicula-form.page.html',
  styleUrls: ['./pelicula-form.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonTextarea,
    IonGrid,
    IonRow,
    IonCol,
    IonSelect,
    IonButtons,
    IonBackButton,
    IonSelectOption,
    CommonModule,
    FormsModule,
  ],
})
export class PeliculaFormPage implements OnInit {
  id?: number;
  pelicula: Pelicula = {
    titulo: '',
    genero: '',
    duracion: '',
    clasificacion: '',
    descripcion: '',
    imagen_url: '',
    video_url: '',
    audio_url: '',
  };

  imagenFile!: File;
  audioFile!: File;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private peliculaService: PeliculasService,
    private sanitizer: DomSanitizer,
    private toastController: ToastController
  ) {
    addIcons({
      "arrow-back-outline": arrowBackOutline
    })
  }

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.pelicula = await this.peliculaService.obtenerPorId(this.id);
    }
  }

  // Permite renderizar iframes de YouTube de forma segura
  getSafeVideoUrl(url: string): SafeResourceUrl {
    if (!url) return '';

    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      url = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      url = `https://www.youtube.com/embed/${videoId}`;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  manejarErrorImg(event: any) {
    event.target.src = 'https://placehold.co/300x450/222/fff?text=URL+Invalida';
  }

  async guardar() {
    if (!this.pelicula.titulo.trim()) {
      alert('El título es obligatorio');

      return;
    }

    /* SUBIR IMAGEN */

    if (this.imagenFile) {
      const imagenUrl = await this.peliculaService.subirImagen(this.imagenFile);

      this.pelicula.imagen_url = imagenUrl;
    }

    /* SUBIR AUDIO */

    if (this.audioFile) {
      const audioUrl = await this.peliculaService.subirAudio(this.audioFile);

      this.pelicula.audio_url = audioUrl;
    }

    /* GUARDAR EN BD */

    if (this.id) {
      const { id, ...datosActualizar } = this.pelicula;
      await this.peliculaService.actualizar(this.id, datosActualizar);
      await this.mostrarToast(
        '🍿 Cambios guardados correctamente'
      );
    } else {
      await this.peliculaService.crear(this.pelicula);
      await this.mostrarToast(
        '🎬 Película agregada al catálogo'
      );
    }

    this.router.navigate(['/peliculas']);
  }

  seleccionarImagen(event: any) {
    this.imagenFile = event.target.files[0];
  }

  seleccionarAudio(event: any) {
    this.audioFile = event.target.files[0];
  }

  async mostrarToast(
    mensaje: string,
  ) {
  
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
      color:"success"
    });
  
    await toast.present();
  }
}
