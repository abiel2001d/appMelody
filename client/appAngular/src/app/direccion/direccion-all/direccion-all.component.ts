import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DireccionAllDataSource, DireccionAllItem } from './direccion-all-datasource';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notificacion.service';
import { DireccionService } from 'src/app/share/direccion.service';
import { LocationService } from 'src/app/share/location.service';

@Component({
  selector: 'app-direccion-all',
  templateUrl: './direccion-all.component.html',
  styleUrls: ['./direccion-all.component.css']
})
export class DireccionAllComponent implements AfterViewInit {
  datos:any;//Guarda la respuesta del API
  destroy$: Subject<boolean>=new Subject<boolean>();
  currentUser:any
  provinces:any
  cantons:any
  distrits:any
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DireccionAllItem>;
  dataSource=new MatTableDataSource<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['provincia', 'canton','distrito','codigoPostal','detalle','telefono','acciones'];


  constructor(private gService:GenericService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private noti: NotificacionService,
    private direccionService: DireccionService,
  private locationService: LocationService ) {
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((x)=>(this.currentUser=x));

    this.locationService.getProvinces()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
      this.provinces = Object.entries(data).map(([key, value]) => ({ key, value }));
    });

    this.direccionService.refesh$.subscribe((success) => {
      if (success) {
        this.listaDirecciones(this.currentUser.user.id);
      }
    });
  }
  cantones(provincia:any){
    this.locationService.getCantons(provincia.toString())
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
    this.cantons = Object.entries(data).map(([key, value]) => ({ key, value }));
    });
  }
  distritos(provincia:any,canton:any){
    this.locationService.getDistricts(provincia.toString(),canton.toString())
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
        this.distrits = Object.entries(data).map(([key, value]) => ({ key, value }));
        });
  }

  getNombreProvincia(item:any){
   // this.cantones(item.provincia)
    //this.distritos(item.provincia,item.canton)
    return (this.provinces.find(province => province.key === item.provincia.toString())).value
  }

  getNombreCanton(id:any){
    return (this.cantons.find(canton => canton.key === id.toString())).value
  }
  getNombreDistrito(id:any){
    return (this.distrits.find(distito => distito.key === id.toString())).value
  }

  ngAfterViewInit(): void {
    this.listaDirecciones(this.currentUser.user.id);
  }

  listaDirecciones(id: any){
    this.gService
      .get('direccion/usuario', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.datos=data;
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log(this.datos);
      })
  }

  actualizarDireccion(id: number) {
    this.direccionService.setSelectedObj(this.datos.find(item => item.id === id));
  }
  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  
}
