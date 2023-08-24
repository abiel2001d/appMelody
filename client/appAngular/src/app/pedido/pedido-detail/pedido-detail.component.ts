import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { Subject, takeUntil } from 'rxjs';
import { LocationService } from 'src/app/share/location.service';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notificacion.service';

@Component({
  selector: 'app-pedido-detail',
  templateUrl: './pedido-detail.component.html',
  styleUrls: ['./pedido-detail.component.css']
})
export class PedidoDetailComponent {
  total:any
  estadoPedido:string
  grandTotal:any
  currentUser:any
  roleSelected:any
  provincias:any
  provincia:any
  cantones:any
  canton:any
  distritos:any
  distrito:any
  datos:any;//Guarda la respuesta del API
  destroy$: Subject<boolean>=new Subject<boolean>();
  displayedColumns: string[] = ['imagen','producto', 'proveedor','cantidad', 'precioUnitario', 'subTotal', 'estado','accion'];
  constructor(
    private gService: GenericService,
    private noti: NotificacionService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private locationService: LocationService,
    private authService: AuthenticationService
    ){
      //Obtener el parámetro
      let id=this.route.snapshot.paramMap.get('id');
      if(!isNaN(Number(id))){
        this.obtenerPedido(id);
      }
  }
  ngOnInit(): void {
    this.authService.currentUser.subscribe((x)=>(this.currentUser=x));
    this.authService.currentSelectedRole.subscribe((valor)=>(this.roleSelected=valor));

  }

  obtenerPedido(id:any){
    this.gService
    .get('pedido',id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any)=>{
      this.datos=data;
      if(this.roleSelected===2){
        this.datos.productos = this.datos.productos.filter((producto: any) => producto.producto.proveedorId === this.currentUser.user.id);

        let pendienteCount = 0;
        let entregadoCount = 0;

        for (const producto of  this.datos.productos) {
          if (producto.estado === 'Pendiente') {
            pendienteCount++;
          } else if (producto.estado === 'Entregado') {
            entregadoCount++;
          }
        }

        if ( this.datos.productos.length === 1) {
          if ( this.datos.productos[0].estado === 'Pendiente') {
            this.estadoPedido='Pendiente';
          } else if ( this.datos.productos[0].estado === 'Entregado') {
            this.estadoPedido='Finalizado';
          }
        } else if (pendienteCount ===  this.datos.productos.length) {
          this.estadoPedido='Pendiente';
        } else if (pendienteCount > 0 && entregadoCount > 0) {
          this.estadoPedido='En progreso';
        } else if (entregadoCount ===  this.datos.productos.length) {
          this.estadoPedido='Finalizado';
        }
        console.log(this.datos);
      }else{
        this.displayedColumns= ['imagen','producto', 'proveedor','cantidad', 'precioUnitario', 'subTotal', 'estado'];
        this.estadoPedido = this.datos.estado
      }
      this.total = this.getTotalSubtotal(this.datos.productos)
      this.grandTotal = this.total * 1.13

        this.locationService.getProvinces()
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          this.provincias = Object.entries(data)
            .map(([key, value]) => ({ key, value }))
         this.provincia= this.provincias[this.datos.direccion.provincia].value;
        });


        this.locationService.getCantons(this.datos.direccion.provincia)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
        this.cantones = Object.entries(data).map(([key, value]) => ({ key, value }));
        this.canton= this.cantones[this.datos.direccion.canton].value;
        });

        this.locationService.getDistricts(this.datos.direccion.provincia, this.datos.direccion.canton)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
        this.distritos = Object.entries(data).map(([key, value]) => ({ key, value }));
        this.distrito= this.distritos[this.datos.direccion.distrito].value;
        });


    });
  }

  ngOnDestroy() {
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

  getBackgroundColor(estado: string): string {
    if (estado === 'Pendiente') {
      return '#f8da5b';
    } else if (estado === 'Finalizado' ||estado === 'Entregado') {
      return '#91ca62';
    } else if (estado === 'En progreso') {
      return '#83cee0';
    } else {
      return 'transparent';
    }
  }

  getTotalSubtotal(productos: any[]): number {
    let totalSubtotal = 0;

    productos.forEach((producto) => {
      totalSubtotal += parseFloat(producto.subTotal);
    });

    return totalSubtotal;
  }

  actualizarEstado(producto: any) {
   
    this.gService
      .update(`pedido/${this.datos.id}`, producto.producto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.datos = data;
        this.noti.mensaje(
          '',
          'Producto entregado con éxito',
          TipoMessage.success
        );
        this.obtenerPedido(this.datos.id);
      });
  }
}  
