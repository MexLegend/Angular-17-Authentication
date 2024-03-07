import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { GOOGLE_API_URL_USERS } from '@core/google-gsi-client/constants';
import { GmailService } from '../services/common/gmail.service';

export const gmailInterceptor: HttpInterceptorFn = (req, next) => {
  const gmailService = inject(GmailService);

  if (req.url.startsWith(GOOGLE_API_URL_USERS)) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${gmailService.$accessToken()}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
