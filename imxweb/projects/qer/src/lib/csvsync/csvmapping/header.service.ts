import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private headersSource = new BehaviorSubject<string[]>([]);
  headers$ = this.headersSource.asObservable();

  constructor() {}

  setHeaders(headers: string[]) {
    this.headersSource.next(headers);
  }
}
