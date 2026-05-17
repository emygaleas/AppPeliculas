import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

export interface Pelicula{
  id?:number,
  titulo:string,
  genero: string,
  duracion: string,
  clasificacion: string,
  descripcion: string,
  imagen_url: string,
  video_url: string,
  audio_url: string,
}

@Injectable({
  providedIn: 'root',
})

export class PeliculasService{
  
  private supabase: SupabaseClient;
  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async listar() {
    const { data, error } = await this.supabase
      .from('peliculas')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data as Pelicula[];
  }

  async obtenerPorId(id: number) {
    const { data, error } = await this.supabase
      .from('peliculas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Pelicula;
  }

  async crear(pelicula: Pelicula) {
    const { data, error } = await this.supabase
      .from('peliculas')
      .insert(pelicula)
      .select();

    if (error) throw error;
    return data;
  }

  async actualizar(id: number, pelicula: Pelicula) {
    const { data, error } = await this.supabase
      .from('peliculas')
      .update(pelicula)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  }

  async eliminar(id: number) {
    const { error } = await this.supabase
      .from('peliculas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async subirImagen(file: File) {

    const nombreArchivo =
      `${Date.now()}-${file.name}`;
  
    const { data, error } =
      await this.supabase.storage
        .from('peliculas-imagenes')
        .upload(nombreArchivo, file);
  
    if(error) throw error;
  
    const { data: urlData } =
      this.supabase.storage
        .from('peliculas-imagenes')
        .getPublicUrl(nombreArchivo);
  
    return urlData.publicUrl;
  }

  async subirAudio(file: File): Promise<string> {
    // 1. Extraemos la extensión original (ej: .mp3)
    const extension = file.name.split('.').pop();
  
    // 2. Limpiamos el nombre original quitando espacios, paréntesis y caracteres raros
    // Reemplaza todo lo que no sea letras, números o guiones por un guion bajo
    const nombreLimpio = file.name
      .split('.' + extension)[0]             // Toma el nombre sin la extensión
      .replace(/[^a-zA-Z0-9]/g, '_')         // Reemplaza caracteres raros por '_'
      .replace(/_+/g, '_');                  // Evita guiones bajos repetidos (___)
  
    // 3. Creamos el nombre final único usando el Timestamp
    const fileName = `${Date.now()}-${nombreLimpio}.${extension}`;
    const { data, error } = await this.supabase.storage
      .from('peliculas-audios')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'audio/mpeg'
      });
  
    if (error) {
      throw error;
    }
  
    // 5. Retornar la URL pública
    const { data: publicUrlData } = this.supabase.storage
      .from('peliculas-audios')
      .getPublicUrl(fileName);
  
    return publicUrlData.publicUrl;
  }

}
