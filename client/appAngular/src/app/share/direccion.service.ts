
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DireccionService {
  private refeshSubject = new Subject<boolean>();
  private selectedObjSubject = new Subject<any>();

  selectedObj$ = this.selectedObjSubject.asObservable();
  refesh$ = this.refeshSubject.asObservable();

  refeshData() {
    this.refeshSubject.next(true);
  }
  
  setSelectedObj(obj:any) {
    this.selectedObjSubject.next(obj);
  }
}