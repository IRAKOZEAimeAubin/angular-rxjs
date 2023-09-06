import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  combineLatest,
  concatMap,
  map,
  merge,
  mergeMap,
  of,
  scan,
  shareReplay,
  switchMap,
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
  constructor(private http: HttpClient) {
    // this.usersWithSwitchMap$.subscribe((item) =>
    //   console.log('switchMap result', item)
    // );
  }

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

  private todoSelectedSubject = new BehaviorSubject<string>('');
  todoSelectedAction$ = this.todoSelectedSubject.asObservable();

  allUsers$ = this.http.get<User[]>('http://localhost:8000/users/').pipe(
    tap((data) => console.log('Users:', data)),
    shareReplay(1),
    catchError(this.handleError)
  );

  allTodos$ = this.http.get<Todo[]>('http://localhost:8000/todos/').pipe(
    tap((items) => console.log('Todos: ', items)),
    shareReplay(1),
    catchError(this.handleError)
  );

  todosWithUsers$ = combineLatest([this.allTodos$, this.allUsers$]).pipe(
    map(([todos, users]) =>
      todos.map((todo) => ({
        ...todo,
        updatedAt: new Intl.DateTimeFormat('en-EN', {
          dateStyle: 'full',
        }).format(new Date(todo.updatedAt!)),
        privacy: this.getPrivacy(todo.published!),
        searchKey: [todo.title],
        creator: users.find((u) => todo.userId === u.id)?.username,
      }))
    ),
    shareReplay(1)
  );

  selectedTodo$ = combineLatest([
    this.todosWithUsers$,
    this.todoSelectedAction$,
  ]).pipe(
    map(([todos, selectedTodoId]) =>
      todos.find((todo) => todo.todoId === selectedTodoId)
    ),
    tap((todo) => console.log('Selected Todo:', todo))
  );

  selectedTodoChanged(selectedTodoId: string) {
    this.todoSelectedSubject.next(selectedTodoId);
  }

  private todoInsertedSubject = new Subject<Todo>();
  todoInsertedAction$ = this.todoInsertedSubject.asObservable();

  todosWithAdd$ = merge(
    this.allTodos$,
    this.todoInsertedAction$.pipe(
      concatMap((newTodo) => {
        return this.http.post<Todo>('http://localhost:8000/todos/', newTodo);
      })
    )
  ).pipe(
    scan(
      (acc, value) => (value instanceof Array ? [...value] : [...acc, value]),
      [] as Todo[]
    )
  );

  addTodo(newTodo?: Todo) {
    newTodo = newTodo || this.fakeTodo();
    this.todoInsertedSubject.next(newTodo);
  }

  private fakeTodo(): Todo {
    return {
      title: 'Learn Angular',
      description: 'Watch the Angular Testing course on Pluralsight.',
      tags: ['learning'],
      status: 'IN PROGRESS',
    };
  }

  // usersWithConcatMap$ = of(
  //   '5c5a26dc-57f7-4c67-b4ff-f7c7aaa06609',
  //   '336c9e59-5ac6-44c8-a4f3-7bd6526d480e'
  // ).pipe(
  //   tap((id) => console.log('concatMap source observable:', id)),
  //   concatMap((id) => this.http.get<User>(`http://localhost:8000/users/${id}`))
  // );

  // usersWithMergeMap$ = of(
  //   '5c5a26dc-57f7-4c67-b4ff-f7c7aaa06609',
  //   '336c9e59-5ac6-44c8-a4f3-7bd6526d480e'
  // ).pipe(
  //   tap((id) => console.log('mergeMap source observable:', id)),
  //   mergeMap((id) => this.http.get<User>(`http://localhost:8000/users/${id}`))
  // );

  // usersWithSwitchMap$ = of(
  //   '5c5a26dc-57f7-4c67-b4ff-f7c7aaa06609',
  //   '336c9e59-5ac6-44c8-a4f3-7bd6526d480e'
  // ).pipe(
  //   tap((id) => console.log('switchMap source observable:', id)),
  //   switchMap((id) => this.http.get<User>(`http://localhost:8000/users/${id}`))
  // );
}
