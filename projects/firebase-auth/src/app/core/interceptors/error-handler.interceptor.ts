import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { IError } from '@core/google-gsi-client/models/error.interface';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let formatedError: IError;

      error.error instanceof ErrorEvent
        ? (formatedError = {
            httpError: error.error.error,
            httpStatus: error.status,
            message: error.error.message,
          })
        : (formatedError = {
            httpError: error.error.httpError,
            httpStatus: error.error.httpStatus,
            message: error.error.message,
          });

      return throwError(() => formatedError);
    })
  );
};
