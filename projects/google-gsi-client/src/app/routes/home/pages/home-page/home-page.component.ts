import { Component, Signal, inject } from '@angular/core';
import { UserService } from '@core/google-gsi-client/services/common/user.service';
import { IUser } from '@core/google-gsi-client/models/user.interface';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { LoadingIconComponent } from '@shared/google-gsi-client/icons/loading-icon.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [JsonPipe, AsyncPipe, LoadingIconComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  private readonly _userService = inject(UserService);

  readonly $userData: Signal<IUser | null> = this._userService.getUserData();
}