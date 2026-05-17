import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Añadido IonToast a los componentes standalone
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
  IonBackButton, IonIcon, IonSpinner, IonButton, IonToast 
} from '@ionic/angular/standalone';

import { arrowBackOutline, playOutline, volumeHighOutline, ellipsisHorizontal, createOutline, trashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Pelicula, PeliculasService } from 'src/app/services/peliculas';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertController } from '@ionic/angular'; // Solo conservamos el de la Alerta

@Component({
  selector: 'app-pelicula',
  templateUrl: './pelicula.page.html',
  styleUrls: ['./pelicula.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonBackButton, IonIcon, IonSpinner, IonButton, IonToast // <-- IMPORTANTE: Agregar IonToast aquí
  ],
})
export class PeliculaPage implements OnInit {
  pelicula!: Pelicula;
  videoSafeUrl!: SafeResourceUrl;
  
  // Variable de control para el Toast moderno
  isToastOpen = false;

  constructor(
    private route: ActivatedRoute,
    private peliculasService: PeliculasService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private alertController: AlertController // Limpiamos el toastController del constructor
  ) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'play-outline': playOutline,
      'volume-high-outline': volumeHighOutline,
      'ellipsis-horizontal': ellipsisHorizontal,
      'create-outline': createOutline,
      'trash-outline': trashOutline,
    });
  }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pelicula = await this.peliculasService.obtenerPorId(id);
    if (this.pelicula && this.pelicula.video_url) {
      const embedUrl = this.transformarAEmbed(this.pelicula.video_url);
      this.videoSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
  }

  transformarAEmbed(url: string): string {
    if (url.includes('embed') || (!url.includes('youtube') && !url.includes('youtu.be'))) {
      return url;
    }
    let videoId = '';
    if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    return `https://www.youtube.com/embed/${videoId}`;
  }

  async eliminar(id: number) {
    const alert = await this.alertController.create({
      header: 'Eliminar película',
      message: '¿Deseas eliminar esta película?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            // 1. Eliminamos de la base de datos
            await this.peliculasService.eliminar(id);
            
            // 2. Encendemos el Toast visual desde el HTML
            this.isToastOpen = true;
            
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  // Se ejecuta automáticamente cuando el Toast termina su animación de cierre
  onToastDismiss() {
    this.isToastOpen = false;
    // Redireccionamos limpiamente sin colgar la UI
    this.router.navigate(['/peliculas']);
  }
}