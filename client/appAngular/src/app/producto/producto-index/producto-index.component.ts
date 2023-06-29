import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-producto-index',
  templateUrl: './producto-index.component.html',
  styleUrls: ['./producto-index.component.css']
})
export class ProductoIndexComponent {

  datos:any;//Guarda la respuesta del API
  destroy$: Subject<boolean>=new Subject<boolean>();

  constructor(private gService:GenericService){
    this.listaProductos()
  }

  listaProductos(){
    this.gService
      .list('producto/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        console.log(data);
        this.datos=data;
      })
  }
  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
