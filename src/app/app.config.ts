import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHighcharts } from 'highcharts-angular';

// i18n v17
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { APP_ROUTES } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

// ---- Core ----
const CORE_PROVIDERS = [
  provideBrowserGlobalErrorListeners(),
  provideZonelessChangeDetection(),
  provideRouter(
    APP_ROUTES,
    withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' }),
  ),
  provideHttpClient(withInterceptors([jwtInterceptor])),
  provideAnimations(),
];

// ---- Charts (carga perezosa de Highcharts y módulos) ----
const CHARTS_PROVIDERS = [
  provideHighcharts({
    instance: () => import('highcharts/esm/highcharts').then(m => m.default),
    modules: () => ([
      import('highcharts/esm/highcharts-more'),
      import('highcharts/esm/modules/accessibility'),
      import('highcharts/esm/modules/exporting'),
      import('highcharts/esm/themes/sunset'),
    ]),
    // Opciones mínimas; mueve estilos de títulos/leyendas a cada chart cuando lo necesites
    options: {
      title: { style: {} },
      legend: { enabled: false },
    },
  }),
];

// ---- i18n ----
const I18N_PROVIDERS = [
  provideTranslateService({
    loader: provideTranslateHttpLoader({
      prefix: 'i18n/',
      suffix: '.json',
      useHttpBackend: true, // evita pasar por interceptores al cargar traducciones
    }),
    fallbackLang: 'es',
    lang: 'es',
  }),
];

export const appConfig: ApplicationConfig = {
  providers: [
    ...CORE_PROVIDERS,
    ...CHARTS_PROVIDERS,
    ...I18N_PROVIDERS,
  ],
};
