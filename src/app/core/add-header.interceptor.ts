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
          'Bearer',
      },
    });

    return next.handle(jsonReq);
  }
}
