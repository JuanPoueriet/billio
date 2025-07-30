import { Injectable, inject, PLATFORM_ID, effect, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translate = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);

  // Idiomas soportados por tus JSON
  private readonly supported = ['es', 'en'];

  // Signal con el idioma actual
  currentLang = signal<string>(this.getInitialLanguage());

  constructor() {
    // Configuración básica del servicio
    this.translate.addLangs(this.supported);
    this.translate.setFallbackLang('es');   // carga y usa fallback si falta alguna clave
    this.translate.use(this.currentLang()); // aplica el idioma inicial

    // Reacciona a cambios del signal y persiste
    effect(() => {
      const lang = this.normalize(this.currentLang());
      this.translate.use(lang);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('user_lang', lang);
      }
    });
  }

  setLanguage(lang: string) {
    this.currentLang.set(this.normalize(lang));
  }

  private getInitialLanguage(): string {
    const browserLang = this.normalize(this.translate.getBrowserLang() ?? 'es');
    let lang = browserLang;
    if (isPlatformBrowser(this.platformId)) {
      lang = this.normalize(localStorage.getItem('user_lang') ?? browserLang);
    }
    return this.supported.includes(lang) ? lang : 'es';
  }

  // es-DO -> es, en-US -> en
  private normalize(lang: string): string {
    if (!lang) return 'es';
    const base = lang.split('-')[0].toLowerCase();
    return this.supported.includes(base) ? base : 'es';
  }
}
