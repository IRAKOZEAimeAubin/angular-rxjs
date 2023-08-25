import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable, catchError } from 'rxjs';
import { Todo } from 'src/types/Todo';
import { DataService } from '../core/data.service';
import { TodoError } from 'src/types/todoError';

@Component({
  selector: 'ra-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  allTodos$ = this.dataService.allTodos$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );
  errorMessage = new TodoError();

  constructor(private dataService: DataService) {}
}
