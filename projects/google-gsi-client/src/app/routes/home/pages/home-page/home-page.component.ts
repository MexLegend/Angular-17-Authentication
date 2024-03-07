import { Component, Signal, inject } from '@angular/core';
import { UserService } from '@core/google-gsi-client/services/common/user.service';
import { IUser } from '@core/google-gsi-client/models/user.interface';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { LoadingIconComponent } from '@shared/google-gsi-client/icons/loading-icon.component';
import { GmailService } from '@core/google-gsi-client/services/common/gmail.service';

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

  readonly $userData: Signal<IUser | null> = this._userService.$user;
  readonly $accessToken: Signal<string | null> = this._gmailService.$accessToken;
  readonly $emailsList: Signal<any[]> = this._gmailService.$emailsList;
  readonly $isLoading: Signal<boolean> = this._gmailService.$isLoadingEmails;

  requestAccessToken(){
    this._gmailService.requestAccessToken();
  }

  getEmails() {
    this._gmailService.getEmails(this.$userData()?.googleUserId!);
  }
}
