import { CommonModule } from '@angular/common';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Component, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { getDatabase, ref, set, update, get } from 'firebase/database';

@Component({
  selector: 'app-login-google',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './login-google.component.html',
  styleUrls: ['./login-google.component.scss'] // Ajustado: styles
})
export class LoginGoogleComponent {
  redirect = ['/primary'];

  constructor(@Optional() private auth: Auth, private router: Router) { }

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
          photoURL: result.user.photoURL, // Foto de perfil
        };

        sessionStorage.setItem('user', JSON.stringify(userInfo));
        console.log('Usuario logueado:', userInfo);

        // Llamar a la función para guardar o actualizar la foto en Firebase Realtime Database
        if (result.user.photoURL) {
          await this.saveProfileImage(result.user.photoURL, result.user.uid, result.user.email ?? '');
        }
      }

      // Redirigir a la página principal
      await this.router.navigate(this.redirect);
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
    }
  }

  // Método para guardar o actualizar la imagen en Firebase Realtime Database
  async saveProfileImage(photoURL: string, uid: string, email: string) {
    try {
      if (photoURL) {
        const db = getDatabase();
        const userRef = ref(db, 'users/' + uid);

        // Verificar si el usuario ya existe en la base de datos
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          // Si ya existe, actualizar solo la URL de la foto
         // await update(userRef, { photoURL, email });
          console.log('Foto de perfil actualizada en Realtime Database:', photoURL);
        } else {
          // Si no existe, crear un nuevo registro
          await set(userRef, {
            email,
            photoURL,
          });
          console.log('Foto de perfil guardada en Realtime Database:', photoURL);
        }
      }
    } catch (error) {
      console.error('Error al guardar o actualizar la imagen en Realtime Database:', error);
    }
  }
}
