import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Todo } from 'src/types/Todo';
import { TodoError } from 'src/types/todoError';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  private handleError(err: HttpErrorResponse): Observable<never> {
    let error = new TodoError();
    if (err.error instanceof ErrorEvent) {
      error.message = err.error.message;
    } else {
      error.status = err.status;
      error.message = err.message;
    }
    console.error(error);
    return throwError(() => error);
  }

  allTodos$ = this.http.get<Todo[]>('http://localhost:8000/todos/').pipe(
    tap((items) => console.log(items)),
    catchError(this.handleError)
  );
}
