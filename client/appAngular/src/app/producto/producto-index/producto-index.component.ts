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
  categorizedData: any = {};

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
        this.categorizeData();
      })

  }

  categorizeData() {
    this.categorizedData = {};
    this.datos.forEach((item) => {
      const categoryId = item.categoria.id;
      if (!this.categorizedData[categoryId]) {
        this.categorizedData[categoryId] = [];
      }
      this.categorizedData[categoryId].push(item);
    });
    console.log(this.categorizedData);
  }
  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getBase64FromBytes(byteArray) {
    var binary = '';
    var bytes = new Uint8Array(byteArray);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'data:image/jpeg;base64,' + btoa(binary);
  }
}
