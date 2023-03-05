import { Component } from '@angular/core';
import { storageKeys } from 'src/environments/storage-keys';
import { StorageService } from './services/util/storage.service';

const MODO_OSCURO_KEY = storageKeys.MODO_OSCURO;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Restaurantero-web';

  constructor(private str: StorageService) {
    this.str.get(MODO_OSCURO_KEY).then( (resp: boolean) => {
      if (resp) {
        document.getElementById('theme-link')?.setAttribute('href', 'assets/layout/styles/theme/theme-dark/orange/theme.css');
      } else {
        document.getElementById('theme-link')?.setAttribute('href', 'assets/layout/styles/theme/theme-light/orange/theme.css');
      }
    })
  }
}
