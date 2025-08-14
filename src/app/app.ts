import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme';
import { LanguageService } from './core/services/language';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  public themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    // this.authService.checkAuthStatus().subscribe();
  }
}