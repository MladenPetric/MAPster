import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

const S3_DOMAIN = '.s3.amazonaws.com/'; 

export const authInterceptor: HttpInterceptorFn = (req: any, next: any) => {

  if (req.url.includes(S3_DOMAIN)) {
    // Propuštamo zahtev BEZ dodavanja Authorization hedra.
    return next(req);
  }

  const auth = inject(AuthService);
  const token = auth.accessToken;

  if (!!token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
}
