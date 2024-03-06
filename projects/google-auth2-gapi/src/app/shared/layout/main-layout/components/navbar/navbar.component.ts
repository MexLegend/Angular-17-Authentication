import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Signal,
  ViewChild,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LogoutIconComponent } from '@shared/google-auth2-gapi/icons/logout-icon.component';
import { NgClass } from '@angular/common';
import { ButtonComponent } from '@shared/google-auth2-gapi/components/button/button.component';
import { UserService } from '@core/google-auth2-gapi/services/common/user.service';
import { IUser } from '@core/google-auth2-gapi/models/user.interface';
import { AuthService } from '@core/google-auth2-gapi/services/common/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    ButtonComponent,
    LogoutIconComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @ViewChild('navbar', { static: false }) navbar?: ElementRef<HTMLElement>;

  private readonly _authService = inject(AuthService);
  private readonly _userService = inject(UserService);

  readonly userData: Signal<IUser | null> = this._userService.getUserData();
  readonly isScrolling: WritableSignal<boolean> = signal(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    const navbarElement = this.navbar?.nativeElement;
    if (!navbarElement) return;

    if (window.scrollY > navbarElement.clientHeight) {
      this.isScrolling.set(true);
    } else {
      this.isScrolling.set(false);
    }
  }

  signOut() {
    this._authService.signOut().subscribe({
      error: console.error,
    });
  }
}
