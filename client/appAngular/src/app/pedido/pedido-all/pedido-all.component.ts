import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, filter, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Component({
  selector: 'app-pedido-all',
  templateUrl: './pedido-all.component.html',
  styleUrls: ['./pedido-all.component.css']
})
export class PedidoAllComponent implements AfterViewInit {
  grandTotal:any
  currentUser:any;
  roleSelected:any
  datos:any;//Guarda la respuesta del API
  destroy$: Subject<boolean>=new Subject<boolean>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource= new MatTableDataSource<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  displayedColumns:any = [];


  constructor(private gService:GenericService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {

  }
  ngOnInit(): void {
    this.authService.currentUser.subscribe((x)=>(this.currentUser=x));
    this.authService.currentSelectedRole.subscribe((valor)=>(this.roleSelected=valor));

  }

  ngAfterViewInit(): void {
    this.listaPedidos();
  }

  listaPedidos() {
    this.gService
      .list('pedido/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);


        switch (this.roleSelected) {
          case 1: // admin
            this.displayedColumns = ['id', 'usuario', 'total', 'fechaPedido', 'estado', 'acciones'];
            this.datos = data;
            break;
          case 2: // proveedor
            this.displayedColumns = ['id', 'usuario', 'total', 'fechaPedido', 'estado', 'acciones'];
            this.datos = data.filter((pedido: any) => {
              return pedido.productos.some((producto: any) => producto.producto.proveedorId === this.currentUser.user.id); });
            break;
          case 3: // cliente
            this.displayedColumns = ['id', 'total', 'fechaPedido', 'estado', 'acciones'];
            this.datos = data.filter((item: any) => item.usuarioId === this.currentUser.user.id);
            break;
          default:
            break;
        }

       
        console.log(this.datos);
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        

      });
  }
  getTotalSubtotal(productos: any[]): number {
    let grandTotal = 0;

    if(this.roleSelected===2){
      productos = productos.filter((producto: any) => producto.producto.proveedorId === this.currentUser.user.id);
    }
    productos.forEach((producto) => {
      grandTotal += parseFloat(producto.subTotal);
    });
    return grandTotal*1.13;
  }

  getEstadoPedido(pedido:any): string{
    let estadoPedido
    let productos
    if(this.roleSelected===2){
      productos = pedido.productos.filter((producto: any) => producto.producto.proveedorId === this.currentUser.user.id);

      let pendienteCount = 0;
      let entregadoCount = 0;

      for (const producto of productos) {
        if (producto.estado === 'Pendiente') {
          pendienteCount++;
        } else if (producto.estado === 'Entregado') {
          entregadoCount++;
        }
      }

      if (productos.length === 1) {
        if (productos[0].estado === 'Pendiente') {
          estadoPedido='Pendiente';
        } else if (productos[0].estado === 'Entregado') {
          estadoPedido='Finalizado';
        }
      } else if (pendienteCount === productos.length) {
        estadoPedido='Pendiente';
      } else if (pendienteCount > 0 && entregadoCount > 0) {
        estadoPedido='En progreso';
      } else if (entregadoCount === productos.length) {
        estadoPedido='Finalizado';
      }

    }else{
      estadoPedido = pedido.estado
    }
    return estadoPedido;
  }
  
 
  detallePedido(id:Number){
    this.router.navigate(['/pedido',id],
    {
      relativeTo:this.route
    })
  }

  getBackgroundColor(estado: string): string {
    if (estado === 'Pendiente') {
      return '#f8da5b';
    } else if (estado === 'Finalizado') {
      return '#91ca62';
    } else if (estado === 'En progreso') {
      return '#83cee0';
    } else {
      return 'transparent';
    }
  }
  

}
