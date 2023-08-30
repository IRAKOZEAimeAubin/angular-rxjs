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
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzVhMjZkYy01N2Y3LTRjNjctYjRmZi1mN2M3YWFhMDY2MDkiLCJpYXQiOjE2OTMzODY3MTcsImV4cCI6MTY5MzQ3MzExN30.1SEmWuxBmh_Ro1eY1gEz4RUqmHcjlS8IQ_Ji1wjsRx0',
      },
    });

    return next.handle(jsonReq);
  }
}
