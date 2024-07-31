import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import 'zone.js';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient()
  ]
});
