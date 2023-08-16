
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SerachProductoService {
  private refeshSubject = new Subject<string>();
  private showSubject = new Subject<boolean>();
  private sortSubject = new Subject<string>();

  refesh$ = this.refeshSubject.asObservable();
  show$ = this.showSubject.asObservable();
  sort$ = this.sortSubject.asObservable();

  filterData(text:string) {
    this.refeshSubject.next(text);
  }

  showSearchbar(status:boolean){
    this.showSubject.next(status);
  }

  sortData(text:string){
    this.sortSubject.next(text);
  }
  
}