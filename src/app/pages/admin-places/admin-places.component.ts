import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { getDatabase, ref, push, onValue } from 'firebase/database'; // Firebase imports

@Component({
  selector: 'app-admin-places',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-places.component.html',
  styleUrls: ['./admin-places.component.scss']
})
export class AdminPlacesComponent implements AfterViewInit {
  private map: L.Map | undefined;
  selectedLocation: { lat: number; lng: number } | null = null;
  placeName: string = '';
  district: string = '';

  ngAfterViewInit(): void {
    this.initMap();
    this.loadLocations(); // Cargar lugares guardados al iniciar
  }

  private initMap(): void {
    // Coordenadas iniciales de Caluco, Sonsonate
    this.map = L.map('map').setView([13.724836018003796, -89.66135501861574], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Manejar clic en el mapa
    this.map.on('click', (event: any) => {
      const { lat, lng } = event.latlng;

      if (confirm('¿Deseas seleccionar esta ubicación?')) {
        this.selectedLocation = { lat, lng };
        console.log('Ubicación seleccionada:', this.selectedLocation);

        // Agregar marcador temporal
        L.marker([lat, lng], { icon: this.getCustomIcon() })
          .addTo(this.map!)
          .bindPopup(`Lat: ${lat}, Lng: ${lng}`)
          .openPopup();
      }
    });
  }

  private getCustomIcon(): L.Icon {
    return L.icon({
      iconUrl: 'images/location.jpg',
      iconSize: [25, 25], // Tamaño del ícono
      iconAnchor: [25, 25] // Punto de anclaje
    });
  }

  private loadLocations(): void {
    const db = getDatabase();
    const locationsRef = ref(db, 'locations');

    onValue(locationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.values(data).forEach((location: any) => {
          const { name, district, coordinates } = location;
          L.marker([coordinates.lat, coordinates.lng], { icon: this.getCustomIcon() })
            .addTo(this.map!)
            .bindPopup(`
              <b>${name}</b><br>
              Distrito: ${district}<br>
              Lat: ${coordinates.lat}, Lng: ${coordinates.lng}
            `);
        });
      }
    });
  }

  async saveLocation(): Promise<void> {
    if (this.selectedLocation && this.placeName && this.district) {
      const locationData = {
        name: this.placeName,
        district: this.district,
        coordinates: this.selectedLocation
      };

      try {
        const db = getDatabase();
        const locationsRef = ref(db, 'locations');
        await push(locationsRef, locationData);

        console.log('Ubicación guardada en Firebase:', locationData);
        alert(`Ubicación guardada con éxito:
          \nNombre: ${locationData.name}
          \nDistrito: ${locationData.district}
          \nLatitud: ${locationData.coordinates.lat}
          \nLongitud: ${locationData.coordinates.lng}`);

        this.placeName = '';
        this.district = '';
        this.selectedLocation = null;
      } catch (error) {
        console.error('Error al guardar en Firebase:', error);
        alert('Ocurrió un error al guardar la ubicación. Inténtalo de nuevo.');
      }
    } else {
      alert('Por favor completa todos los campos y selecciona una ubicación.');
    }
  }
}
