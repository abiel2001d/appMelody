import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-producto-index',
  templateUrl: './producto-index.component.html',
  styleUrls: ['./producto-index.component.css']
})
export class ProductoIndexComponent {
  estadoInventario:any
  datos:any;//Guarda la respuesta del API
  destroy$: Subject<boolean>=new Subject<boolean>();
  categorizedData: any = {};

  constructor(private gService:GenericService,
    private router: Router,
    private route: ActivatedRoute){
    this.listaProductos()
  }

  getBackgroundColor(cantidad: any): string {
    if (cantidad <= 0) {
      this.estadoInventario="Agotado"
      return '#f8da5b';
    } else if (cantidad >0) {
      this.estadoInventario="Disponible"
      return '#91ca62';
    } else {
      return 'transparent';
    }
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

  detalleProducto(id:Number){
    this.router.navigate(['/producto',id],
    {
      relativeTo:this.route
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
