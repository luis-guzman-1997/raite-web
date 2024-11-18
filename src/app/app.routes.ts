import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PrimaryComponent } from './pages/primary/primary.component';
import { CanActivateGuard } from './auth/can-activate.guard';
import { AdminPlacesComponent } from './pages/admin-places/admin-places.component';

export const routes: Routes = [
    { path: 'primary', component: PrimaryComponent, canActivate: [CanActivateGuard] },  // Ruta protegida
    { path: 'admin-places', component: AdminPlacesComponent, canActivate: [CanActivateGuard] },  // Ruta protegida
    { path: 'home', component: HomeComponent },  // Ruta pública
    { path: '', component: HomeComponent },  // Ruta pública
    { path: '', redirectTo: '/home', pathMatch: 'full' },
];
