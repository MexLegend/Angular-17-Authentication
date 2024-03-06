import { Component, Signal, inject } from '@angular/core';
import { UserService } from '@core/google-gapi/services/common/user.service';
import { IUser } from '@core/google-gapi/models/user.interface';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { GmailService } from '@core/google-gapi/services/common/gmail.service';
import { IGmailMailDetails } from '@core/google-gapi/models/gmail.interface';
import { LoadingIconComponent } from '@shared/google-gapi/icons/loading-icon.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [JsonPipe, AsyncPipe, LoadingIconComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  private readonly _userService = inject(UserService);
  private readonly _gmailService = inject(GmailService);

  readonly $userData: Signal<IUser | null> = this._userService.getUserData();
  readonly $emailsList: Signal<IGmailMailDetails[]> =
    this._gmailService.getEmails(this.$userData()!.id!);
  readonly $isLoading: Signal<boolean> = this._gmailService.getIsLoading();
}
