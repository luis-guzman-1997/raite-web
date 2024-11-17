import { CommonModule } from '@angular/common';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Component, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { getDatabase, ref, set } from 'firebase/database';

@Component({
  selector: 'app-login-google',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './login-google.component.html',
  styleUrl: './login-google.component.scss'
})
export class LoginGoogleComponent {
  redirect = ['/primary'];

  constructor(@Optional() private auth: Auth, private router: Router) {}

  // Método para login y redirección
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);

      if (result.user) {
        // Guardar la información básica del usuario en sessionStorage
        const userInfo = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,  // Foto de perfil
        };

        sessionStorage.setItem('user', JSON.stringify(userInfo));
        console.log('Usuario logueado:', userInfo);

        // Llamar a la función para guardar la foto en Firebase Realtime Database
        if (result.user.photoURL) {
          await this.saveProfileImage(result.user.photoURL, result.user.uid);
        }
      }

      // Redirigir a la página principal
      await this.router.navigate(this.redirect);
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
    }
  }

  // Método para guardar la imagen en Firebase Realtime Database
  async saveProfileImage(photoURL: string, uid: string) {
    try {
      if (photoURL) {
        // Guardar la URL de la foto en Realtime Database
        const db = getDatabase();
        const userRef = ref(db, 'users/' + uid); // Ruta donde se guarda la información del usuario

        await set(userRef, {
          photoURL: photoURL, // Almacenar la URL de la imagen
        });

        console.log('Foto de perfil guardada en Realtime Database:', photoURL);
      }
    } catch (error) {
      console.error('Error al guardar la imagen en Realtime Database:', error);
    }
  }
}
