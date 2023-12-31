import { Component,OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { CartService } from 'src/app/share/cart.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notificacion.service';
import { SerachProductoService } from 'src/app/share/search.service';

@Component({
  selector: 'app-producto-index',
  templateUrl: './producto-index.component.html',
  styleUrls: ['./producto-index.component.css']
})
export class ProductoIndexComponent implements OnInit{
  estadoInventario:any
  datos:any;//Guarda la respuesta del API
  destroy$: Subject<boolean>=new Subject<boolean>();
  loading: boolean ;
  roleSelected:any
  isAutenticated:boolean
  filterDatos:any
  filterParm:any
  sortData:any
  categoriaSelected:any
  constructor(private gService:GenericService,
    private router: Router,
    private cartService:CartService,
    private notificacion:NotificacionService,
    private authService: AuthenticationService,
    private serachService:SerachProductoService,
    private route: ActivatedRoute){
    this.listaProductosAll()
  }

  ngOnInit(): void {
    this.authService.currentSelectedRole.subscribe((valor)=>(this.roleSelected=valor));
    this.authService.isAuthenticated.subscribe((valor) => (this.isAutenticated = valor));
    this.serachService.refesh$.subscribe((valor) => {this.filterProductos(valor);this.filterParm=valor})
    this.serachService.sort$.subscribe((valor) => {this.sortDatos(valor);this.sortData=valor})
    this.serachService.showSearchbar(true)
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

  filterProductos(text:string){
    if(!text){
      this.filterDatos=this.datos.filter(x=>x.categoria.id==this.categoriaSelected);
    }else{
      this.filterDatos=this.datos.filter(x=>x.categoria.id==this.categoriaSelected);
      this.filterDatos=this.filterDatos.filter(
        producto=> producto?.descripcion.toLowerCase().
                          includes(text.toLowerCase())
      )
    }
    this.sortDatos(this.sortData)
  }

  sortDatos(sortingOrder:string) {
    this.filterDatos.sort((a, b) => {
        const priceA = parseFloat(a?.precio || "0"); // Convert precio to number
        const priceB = parseFloat(b?.precio || "0");

        if (sortingOrder === 'asc') {
          return priceA - priceB;
        } else {
          return priceB - priceA;
        }
      });
  }

  listaProductosAll() {
    this.categoriaSelected=1
    this.loading=true
    this.gService
      .list('producto')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data.filter(x=>x.estado==true);
        this.loading=false
        this.categoryFilter(this.categoriaSelected)
      });
  }

  categoryFilter(id: any) {
    this.filterDatos=this.datos.filter(x=>x.categoria.id==id);
    this.filterProductos(this.filterParm)
   
  }
  
  comprar(producto:any){

    if(producto.cantidad<1){
      this.notificacion.mensaje(
        '',
        producto.descripcion+ ' está agotado',
        TipoMessage.error
      )
    } else{
      
    this.gService
    .get('producto',parseInt(producto.id))
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any)=>{
      //Agregar videojuego obtenido del API al carrito
      this.cartService.addToCart(data,true);
      //Notificar al usuario
      this.notificacion.mensaje(
        '',
        data.descripcion+ ' agregado al pedido',
        TipoMessage.success
      )
    });
    }   

  }

  onTabChange(event: MatTabChangeEvent) {
    this.categoriaSelected = event.index+1; 
    this.categoryFilter(this.categoriaSelected);
  }

  detalleProducto(id:Number){
    this.router.navigate(['/producto',id],
    {
      relativeTo:this.route
    })
  }


  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.serachService.showSearchbar(false)
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
