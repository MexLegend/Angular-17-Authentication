import { Pipe, PipeTransform } from '@angular/core';
import { IUser } from '@core/firebase-auth/models';

@Pipe({
  name: 'authProviderLink',
  standalone: true,
})
export class AuthProviderLinkPipe implements PipeTransform {

  transform(user: IUser, providerId: string): boolean {
    const isLinked = user.providerData.some((provider) => provider.providerId === providerId);
    return !!isLinked;
  }
}
