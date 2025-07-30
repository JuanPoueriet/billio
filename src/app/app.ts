import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme';
import { LanguageService } from './core/services/language';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
}
