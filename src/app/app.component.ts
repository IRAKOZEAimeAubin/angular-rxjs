import { Component, OnInit, VERSION } from '@angular/core';
import { from, map, of, take, tap } from 'rxjs';

@Component({
  selector: 'ra-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = `Angular ${VERSION.major}`;
  ngOnInit() {
    // of([2, 3, 5, 7]).subscribe({
    //   next: (item) => console.log(`resulting item: ${item}`),
    //   error: (err) => console.error(`Error: ${err}`),
    //   complete: () => console.log(`--No more items, Go Home!--`),
    // });
    // from([2, 3, 5, 7]).subscribe({
    //   next: (item) => console.log(`resulting item: ${item}`),
    //   error: (err) => console.error(`Error: ${err}`),
    //   complete: () => console.log(`--No more items, Go Home!--`),
    // });
    // of(...[2, 3, 5, 7]).subscribe({
    //   next: (item) => console.log(`resulting item: ${item}`),
    //   error: (err) => console.error(`Error: ${err}`),
    //   complete: () => console.log(`--No more items, Go Home!--`),
    // });

    of(2, 3, 5, 7)
      .pipe(
        map((item) => item * 2),
        // tap((item) => console.log(item))
        take(2)
      )
      .subscribe({
        next: (item) => console.log(item),
      });
  }
}
