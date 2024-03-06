import { NgOptimizedImage } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly _authService = inject(AuthService);
  readonly user = signal<any>(null);

  constructor(){
    const userData = this._authService.getUser();
    this.user.set(userData);
  }

  logout(){
    this._authService.logout();
  }
}
