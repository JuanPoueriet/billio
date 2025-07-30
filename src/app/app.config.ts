import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHighcharts } from 'highcharts-angular';

// ✅ ngx-translate v17 (provider functions)
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(APP_ROUTES),
    provideHttpClient(),
    provideAnimations(),
    provideHighcharts({
      instance: () => import('highcharts/esm/highcharts').then(m => m.default),
      options: {
        title: { style: {} },
        legend: { enabled: false },
      },
      modules: () => ([
        import('highcharts/esm/highcharts-more'),
        import('highcharts/esm/modules/accessibility'),
        import('highcharts/esm/modules/exporting'),
        import('highcharts/esm/themes/sunset'),
      ]),
    }),

    // 👇 Configuración recomendada en v17
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        // usa ruta relativa al <base href>. El valor por defecto es '/assets/i18n/'.
        prefix: 'i18n/',   // sin "./"
        suffix: '.json',
        useHttpBackend: true      // evita interceptores al cargar /assets
      }),
      fallbackLang: 'es',         // idioma de respaldo
      lang: 'es'                  // idioma inicial
    }),
  ]
};
