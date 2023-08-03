import { Component,OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { CartService } from 'src/app/share/cart.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notificacion.service';

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
  constructor(private gService:GenericService,
    private router: Router,
    private cartService:CartService,
    private notificacion:NotificacionService,
    private authService: AuthenticationService,
    private route: ActivatedRoute){
    this.listaProductos(1)
  }

  ngOnInit(): void {
    this.authService.currentSelectedRole.subscribe((valor)=>(this.roleSelected=valor));
    this.authService.isAuthenticated.subscribe((valor) => (this.isAutenticated = valor));
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

  listaProductos(id: any) {
   
    this.gService
      .get('producto/categoria', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
      
      });
  }
  
  comprar(id:number){
    this.gService
    .get('producto',id)
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

  onTabChange(event: MatTabChangeEvent) {
    this.datos.length = 0;
    const tabId = event.index+1; 
    this.listaProductos(tabId);
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
