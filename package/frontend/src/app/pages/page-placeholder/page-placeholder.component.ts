import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-page-placeholder',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './page-placeholder.component.html',
  styleUrl: './page-placeholder.component.scss',
})
export class PagePlaceholderComponent {
  title$: Observable<string>;

  constructor(private route: ActivatedRoute) {
    this.title$ = this.route.data.pipe(map((data) => data['title'] as string));
  }
}
