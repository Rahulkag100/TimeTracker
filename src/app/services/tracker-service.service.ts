import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrackerService {
  public dataSubject = new Subject<any[]>();

  data$ = this.dataSubject.asObservable();

  constructor() {}

  updateData(newData: any[]) {
    this.dataSubject.next(newData);
  }
}
