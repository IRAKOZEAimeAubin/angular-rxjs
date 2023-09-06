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
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzVhMjZkYy01N2Y3LTRjNjctYjRmZi1mN2M3YWFhMDY2MDkiLCJpYXQiOjE2OTM5ODk2OTMsImV4cCI6MTY5NDA3NjA5M30.tuvGcz8Gp2z1fa3qN_DQxsQIqYePeS4qoUrHZsZpwcQ',
      },
    });

    return next.handle(jsonReq);
  }
}
