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
      this.errorMessage = err;
      return EMPTY;
    })
  );

  errorMessage = new TodoError();

  allUsers$ = this.dataService.allUsers$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  todo$ = this.dataService.selectedTodo$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  onSelected(id: string) {
    this.userSelectedSubject.next(id);
  }

  onSelectedSingle(id: string) {
    this.dataService.selectedTodoChanged(id);
  }

  constructor(private dataService: DataService) {}
}
