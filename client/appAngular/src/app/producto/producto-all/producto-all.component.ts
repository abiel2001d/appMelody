import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Component({
  selector: 'app-producto-all',
  templateUrl: './producto-all.component.html',
  styleUrls: ['./producto-all.component.css']
})
export class ProductoAllComponent implements AfterViewInit {
  datos:any;//Guarda la respuesta del API
  destroy$: Subject<boolean>=new Subject<boolean>();
  currentUser: any;
  roleSelected:any
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource=new MatTableDataSource<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['descripcion', 'categoria','cantidad','precio', 'estado','acciones'];

  constructor(private gService:GenericService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService) {
    this.authService.currentUser.subscribe((x)=>(this.currentUser=x));
    this.authService.currentSelectedRole.subscribe((valor)=>(this.roleSelected=valor));

  }

  ngAfterViewInit(): void {
    this.listaProductos();
  }
 
  listaProductos(){
    this.gService
      .list('producto/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.datos=data;
        if(this.roleSelected===2){
          this.dataSource = new MatTableDataSource(this.datos.filter(item => item.proveedorId == this.currentUser.user.id));
        }else{
          this.dataSource = new MatTableDataSource(this.datos)
        }
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log(this.dataSource);
      })
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
  crearProducto() {
    this.router.navigate(['/producto/create'], {
      relativeTo: this.route,
    });
  }
  actualizarProducto(id: number) {
    this.router.navigate(['/producto/update', id], {
      relativeTo: this.route,
    });
  }
}
