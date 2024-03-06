import { Component, inject } from '@angular/core';
import { GoogleIconComponent } from '../../icons/google-icon.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [GoogleIconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly bgUrl =
    'https://res.cloudinary.com/devmexsoft/image/upload/v1708543920/Projects%20Thumbnails/netflix-octobre-contenus-2022_zthxnv.jpg';

  private readonly _authService = inject(AuthService);

  login() {
    this._authService.login();
  }
}
