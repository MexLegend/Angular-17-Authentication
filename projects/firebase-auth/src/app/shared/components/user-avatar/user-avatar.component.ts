import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IUser } from '@core/firebase-auth/models';
import { UserInitialsAvatarPipe } from '@core/firebase-auth/pipes';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [NgOptimizedImage, UserInitialsAvatarPipe],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss',
})
export class UserAvatarComponent {
  @Input({ required: true }) userData!: IUser;
}
