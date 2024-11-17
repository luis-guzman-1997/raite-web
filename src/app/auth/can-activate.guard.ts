import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = sessionStorage.getItem('user');  // O usar el servicio de autenticación de Firebase

    if (user) {
      // Si el usuario está logueado, permite el acceso
      return true;
    } else {
      // Si el usuario no está logueado, redirige al login
      this.router.navigate(['/']);
      return false;
    }
  }
}
