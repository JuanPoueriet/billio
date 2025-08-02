import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHighcharts } from 'highcharts-angular';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { APP_ROUTES } from './app.routes';

// ---- Core ----
const CORE_PROVIDERS = [
  provideBrowserGlobalErrorListeners(),
  provideZonelessChangeDetection(),
  provideRouter(
    APP_ROUTES,
    withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' }),
  ),
  provideHttpClient(), // Sin interceptor JWT
  provideAnimations(),
];

// ---- Charts ----
const CHARTS_PROVIDERS = [
  provideHighcharts({
    instance: () => import('highcharts/esm/highcharts').then(m => m.default),
    modules: () => ([
      import('highcharts/esm/highcharts-more'),
      import('highcharts/esm/modules/accessibility'),
      import('highcharts/esm/modules/exporting'),
      import('highcharts/esm/themes/sunset'),
    ]),
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
      useHttpBackend: true,
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