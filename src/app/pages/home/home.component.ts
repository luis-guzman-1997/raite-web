import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SlideComponent } from '../../shared/slide/slide.component';
import { TitleSubtitleComponent } from '../../shared/title-subtitle/title-subtitle.component';
import { LoginGoogleComponent } from '../../components/login-google/login-google.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    SlideComponent,
    TitleSubtitleComponent,
    LoginGoogleComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
