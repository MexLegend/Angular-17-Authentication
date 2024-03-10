import { Pipe, PipeTransform } from '@angular/core';
import { AVATAR_BG_COLORS } from '@core/firebase-auth/constants';
import { IUserAvatar } from '@core/firebase-auth/models';
import { MD5 } from 'crypto-js';

@Pipe({
  name: 'userInitialsAvatar',
  standalone: true,
})
export class UserInitialsAvatarPipe implements PipeTransform {
  transform(name: string): IUserAvatar {
    const initials = name
      .split(/[\s-]+/)
      .map((word) =>
        /[0-9]/.test(word) && word.length === 1 ? word : word.charAt(0)
      )
      .join('');

    const colors = AVATAR_BG_COLORS;
    const MD5HashedName = MD5(name).toString();
    const randomColorKey =
      parseInt(MD5HashedName.slice(-8), 16) % colors.length;
    const background: string = colors[randomColorKey];

    return {
      initials,
      bgColor: background,
    };
  }
}
