import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from 'src/app/share/cart.service';
import { GenericService } from 'src/app/share/generic.service';
import { LocationService } from 'src/app/share/location.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notificacion.service';

@Component({
  selector: 'app-pedido-index',
  templateUrl: './pedido-index.component.html',
  styleUrls: ['./pedido-index.component.css']
})
export class PedidoIndexComponent {
  provincias:any
  provincia:any
  cantones:any
  canton:any
  distritos:any
  distrito:any
  totalWithIVA:any
  selectedDireccion:any
  selectedMetodoPago:any
  metodosPagoList:any
  direccionList:any
  total = 0;
  fecha = Date.now();
  qtyItems = 0;
  //Tabla
  displayedColumns: string[] = ['imagen','producto','proveedor' ,'precio', 'cantidad', 'subtotal','acciones'];
  dataSource = new MatTableDataSource<any>();
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentUser:any
  constructor(
    private cartService: CartService,
    private noti: NotificacionService,
    private gService: GenericService,
    private router: Router,
    private locationService: LocationService,
  ) {
    let user={
      id:462578415,
      rol: 3,
      nombre:"Vilma Salguera",
      email:"vsalguera@hotmail.com",
      telefono:"8458-7433"
    }
    this.currentUser=user;
    this.listaMetodosPago(this.currentUser.id)
    this.listaDirecciones(this.currentUser.id)
  }

  ngOnInit(): void {
   
    this.cartService.currentDataCart$.subscribe(data=>{
     this.dataSource=new MatTableDataSource(data)
    })
    this.total=this.cartService.getTotal()
    this.totalWithIVA=this.total*1.13
   }

   actualizarCantidad(item: any) {
    this.cartService.addToCart(item);
    this.total=this.cartService.getTotal();
    this.totalWithIVA=this.total*1.13
  }
  eliminarItem(item: any) {
    this.cartService.removeFromCart(item);
    this.total=this.cartService.getTotal();
    this.totalWithIVA=this.total*1.13
    this.noti.mensaje('',
    'Producto eliminado',
    TipoMessage.success)
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

  listaMetodosPago(id:any) {
    this.metodosPagoList = null;
    this.gService
      .get('metodoPago/usuario',id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.metodosPagoList = data;
      });
  }
  listaDirecciones(id:any) {
    this.direccionList = null;
    this.gService
      .get('direccion/usuario',id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.direccionList = data;
      });
  }

  onMetodoPagoSelectionChange(event: any) {
    // Assign the selected item from the event value to the variable
    this.selectedMetodoPago = event.value;
  }

  onDireccionSelectionChange(event: any) {
    // Assign the selected item from the event value to the variable
    this.selectedDireccion = event.value;

    this.locationService.getProvinces()
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          this.provincias = Object.entries(data)
            .map(([key, value]) => ({ key, value }))
         this.provincia= this.provincias[this.selectedDireccion.provincia].value;
        });


        this.locationService.getCantons(this.selectedDireccion.provincia)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
        this.cantones = Object.entries(data).map(([key, value]) => ({ key, value }));
        this.canton= this.cantones[this.selectedDireccion.canton].value;
        });

        this.locationService.getDistricts(this.selectedDireccion.provincia, this.selectedDireccion.canton)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
        this.distritos = Object.entries(data).map(([key, value]) => ({ key, value }));
        this.distrito= this.distritos[this.selectedDireccion.distrito].value;
        });


  }

  registrarPedido() {
    if(this.cartService.getItems!=null){
       //Obtener los items del carrito de compras
       let itemsCarrito=this.cartService.getItems;
       //Armar la estructura de la tabla intermedia
       //[{'videojuegoId':valor, 'cantidad':valor}]
       let detalles=itemsCarrito.map(
         x=>({
           ['producto']:x.idItem,
           ['cantidad']: x.cantidad,
           ['precioUnitario']: x.product.precio,
           ['subTotal']: x.subtotal,
           ['estado']: "Pendiente",
         })
       )
       //Datos para el API
       let infoOrden={
        'total':this.totalWithIVA,
        'estado':"Pendiente",
        'usuario':this.currentUser.id,
        'direccion':this.selectedDireccion.id,
        'metodoPago':this.selectedMetodoPago.id,
        'productos':detalles,
       }
       this.gService.create('pedido',infoOrden)
       .subscribe((respuesta:any)=>{
         this.noti.mensaje('Orden',
         'Pedido realizado exitosamente',
         TipoMessage.success)
         this.cartService.deleteCart();
         this.total=this.cartService.getTotal();
         console.log(respuesta)
         this.router.navigate(['/pedido/all'], {
          queryParams: { create: 'true' }
          });
       })
    }else{
     this.noti.mensaje('',
     'Agregue producto(s) al pedido',
     TipoMessage.warning)
     
    }
   }
}
