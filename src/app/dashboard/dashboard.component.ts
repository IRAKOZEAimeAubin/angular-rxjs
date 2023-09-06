import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EMPTY,
  catchError,
  map,
  filter,
  Subject,
  combineLatest,
  startWith,
  BehaviorSubject,
} from 'rxjs';
import { DataService } from '../core/data.service';
import { TodoError } from 'src/types/todoError';
import { ErrorInterface } from 'src/types/error';

@Component({
  selector: 'ra-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  // private userSelectedSubject = new Subject<string>();
  private userSelectedSubject = new BehaviorSubject<string>('');
  userSelectedActions$ = this.userSelectedSubject.asObservable();

  allTodos$ = combineLatest([
    this.dataService.todosWithUsers$,
    this.userSelectedActions$,
    // .pipe( startWith( '' ) ),
  ]).pipe(
    map(([todos, selectedUserId]) =>
      todos.filter((todo) =>
        selectedUserId ? todo.userId === selectedUserId : true
      )
    ),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  // errorMessage = new TodoError();
  private errorMessageSubject = new Subject<ErrorInterface>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  allUsers$ = this.dataService.allUsers$.pipe(
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  todo$ = this.dataService.selectedTodo$.pipe(
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  onSelected(id: string) {
    this.userSelectedSubject.next(id);
  }

  onSelectedSingle(id: string) {
    this.dataService.selectedTodoChanged(id);
  }

  onAdd(): void {
    this.dataService.addTodo();
  }

  constructor(private dataService: DataService) {}
}
