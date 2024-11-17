import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-primary',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './primary.component.html',
  styleUrl: './primary.component.scss'
})
export class PrimaryComponent {
  user: any;

  ngOnInit(): void {
    // Recupera la información del usuario desde sessionStorage
    const storedUser = sessionStorage.getItem('user');

    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  logout(): void {
    // Elimina el usuario de sessionStorage al cerrar sesión
    sessionStorage.removeItem('user');
    // Redirigir a la página de login o home
    window.location.href = '/home';  // O la ruta que prefieras
  }
}
