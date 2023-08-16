import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MetodoPagoAllDataSource, MetodoPagoAllItem } from './metodo-pago-all-datasource';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { MetodoPagoService } from 'src/app/share/metodoPago.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notificacion.service';

@Component({
  selector: 'app-metodo-pago-all',
  templateUrl: './metodo-pago-all.component.html',
  styleUrls: ['./metodo-pago-all.component.css']
})
export class MetodoPagoAllComponent implements AfterViewInit {
  datos:any;//Guarda la respuesta del API
  destroy$: Subject<boolean>=new Subject<boolean>();
  currentUser:any

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<MetodoPagoAllItem>;
  dataSource=new MatTableDataSource<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['numTajeta', 'tipo','fechaVenc','codSeguridad','acciones'];

  constructor(private gService:GenericService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private noti: NotificacionService,
    private metodoPagoService: MetodoPagoService
    ) {
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((x)=>(this.currentUser=x));
    
    this.metodoPagoService.refesh$.subscribe((success) => {
      if (success) {
        this.listaMetodosPago(this.currentUser.user.id);
      }
      
    });
    
    
  }
  ngAfterViewInit(): void {
    this.listaMetodosPago(this.currentUser.user.id);
  }

  listaMetodosPago(id: any){
    this.gService
      .get('metodoPago/usuario', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.datos=data;
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log(this.datos);
      })
  }

  actualizarMetodoPago(id: number) {
    this.metodoPagoService.setSelectedObj(this.datos.find(item => item.id === id));
  }
  

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }




}
