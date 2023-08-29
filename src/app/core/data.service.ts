import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  combineLatest,
  map,
  tap,
  throwError,
} from 'rxjs';
import { Todo } from 'src/types/Todo';
import { User } from 'src/types/User';
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

  private getPrivacy(published: boolean): string {
    if (!published) return 'private';
    return 'public';
  }

  allUsers$ = this.http.get<User[]>('http://localhost:8000/users/').pipe(
    tap((data) => console.log('Users:', data)),
    catchError(this.handleError)
  );

  allTodos$ = this.http.get<Todo[]>('http://localhost:8000/todos/').pipe(
    tap((items) => console.log('Todos: ', items)),
    catchError(this.handleError)
  );

  todosWithUsers$ = combineLatest([this.allTodos$, this.allUsers$]).pipe(
    map(([todos, users]) =>
      todos.map((todo) => ({
        ...todo,
        updatedAt: new Intl.DateTimeFormat('en-EN', {
          dateStyle: 'full',
        }).format(new Date(todo.updatedAt)),
        privacy: this.getPrivacy(todo.published),
        searchKey: [todo.title],
        creator: users.find((u) => todo.userId === u.id)?.username,
      }))
    )
  );
}
