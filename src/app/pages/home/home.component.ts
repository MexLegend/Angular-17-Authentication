import { Component, inject, signal } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../core/services/auth.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, JsonPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly _authService = inject(AuthService);
  readonly user = signal<any>(null);

  constructor() {
    const userData = this._authService.getUser();
    this.user.set(userData);
  }
}
