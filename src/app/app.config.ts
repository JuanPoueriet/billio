import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHighcharts } from 'highcharts-angular';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
// import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
// import { environment } from './environments/environment';

import { APP_ROUTES } from './app.routes';
import { RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY, RecaptchaSettings, RecaptchaV3Module } from 'ng-recaptcha-19';
import { environment } from '../environments/environment';
import { ThemeService } from './core/services/theme';
import { authInterceptor } from './core/interceptors/auth.interceptor';

const CORE_PROVIDERS = [
  provideBrowserGlobalErrorListeners(),
  provideZonelessChangeDetection(),
  provideRouter(
    APP_ROUTES,
    withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' }),
  ),
  provideHttpClient(),
  provideAnimations(),
];

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

const RECAPTCHA_PROVIDERS = [
  RecaptchaV3Module,
  { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptcha.siteKey },
  {
    provide: RECAPTCHA_SETTINGS,
    // Cambia de 'useValue' a 'useFactory'
    useFactory: (themeService: ThemeService): RecaptchaSettings => {
      return {
        siteKey: environment.recaptcha.siteKey,
        size: 'invisible',
        badge: 'bottomleft', // Cambia esto si necesitas otro badge
        // Ahora el tema es dinámico basado en el servicio
        theme: themeService.activeTheme(),
      };
    },
    deps: [ThemeService] // Declara la dependencia a inyectar
  }
];

export const appConfig: ApplicationConfig = {
  providers: [
    ...CORE_PROVIDERS,
    ...CHARTS_PROVIDERS,
    ...I18N_PROVIDERS,
    ...RECAPTCHA_PROVIDERS,
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
  ],
};