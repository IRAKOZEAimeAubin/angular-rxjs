import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log(`Header added to - ${request.url}`);

    let jsonReq: HttpRequest<any> = request.clone({
      setHeaders: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzVhMjZkYy01N2Y3LTRjNjctYjRmZi1mN2M3YWFhMDY2MDkiLCJpYXQiOjE2OTI5NTUzNDcsImV4cCI6MTY5MzA0MTc0N30.yqWDl_nNWqgwdWAxfD9bmaTB7g2ube06yAm1kIHTdsY',
      },
    });

    return next.handle(jsonReq);
  }
}
