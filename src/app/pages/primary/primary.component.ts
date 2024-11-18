import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { getDatabase, ref, get } from 'firebase/database';
import { SlideComponent } from '../../shared/slide/slide.component';
import { TitleSubtitleComponent } from '../../shared/title-subtitle/title-subtitle.component';

@Component({
  selector: 'app-primary',
  standalone: true,
  imports: [
    CommonModule,
    SlideComponent,
    TitleSubtitleComponent
  ],
  templateUrl: './primary.component.html',
  styleUrl: './primary.component.scss'
})
export class PrimaryComponent implements OnInit {
  user: any;
  photoURL: string = ''; // Para almacenar la URL de la foto del usuario

  ngOnInit(): void {
    // Recupera la información del usuario desde sessionStorage
    const storedUser = sessionStorage.getItem('user');

    if (storedUser) {
      this.user = JSON.parse(storedUser);

      // Obtener la URL de la foto desde Realtime Database
      this.getUserProfilePhoto(this.user.uid);
    }
  }

  // Método para obtener la foto del usuario desde Realtime Database
  async getUserProfilePhoto(uid: string): Promise<void> {
    try {
      const db = getDatabase();
      const userRef = ref(db, 'users/' + uid); // Ruta en Realtime Database
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        // Si existe la URL de la foto, la asignamos a la variable
        const userData = snapshot.val();
        this.photoURL = userData?.photoURL || ''; // Si no existe, dejar vacío
      } else {
        console.log('No se encontró la información del usuario.');
      }
    } catch (error) {
      console.error('Error al obtener la foto de perfil:', error);
    }
  }

  logout(): void {
    // Elimina el usuario de sessionStorage al cerrar sesión
    sessionStorage.removeItem('user');
    // Redirigir a la página de login o home
    window.location.href = '/home';  // O la ruta que prefieras
  }
}
