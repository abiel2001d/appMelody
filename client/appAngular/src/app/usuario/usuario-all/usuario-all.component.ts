import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsuarioAllDataSource, UsuarioAllItem } from './usuario-all-datasource';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { UsuarioDialogComponent } from '../usuario-dialog/usuario-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificacionService, TipoMessage } from 'src/app/share/notificacion.service';

@Component({
  selector: 'app-usuario-all',
  templateUrl: './usuario-all.component.html',
  styleUrls: ['./usuario-all.component.css']
})
export class UsuarioAllComponent implements AfterViewInit {
  datos:any;//Guarda la respuesta del API
  destroy$: Subject<boolean>=new Subject<boolean>();
  currentUser: any;
  roleSelected:any
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource=new MatTableDataSource<any>();


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['nombre', 'email', 'id', 'telefono', 'estado','acciones'];

  constructor(private gService:GenericService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    public dialog: MatDialog,
    private noti: NotificacionService,
    ) {
  }

  ngAfterViewInit(): void {
    this.listaUsuarios();
  }

  listaUsuarios(){
    this.gService
      .list('usuario/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.datos=data;
        this.dataSource = new MatTableDataSource(this.datos)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log(this.dataSource);
      })
  }

  detalleUsuario(id:Number){
    this.router.navigate(['/usuario',id],
    {
      relativeTo:this.route
    })
  }
  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  actualizarUsuario(id: number) {
    
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '900px',
      data: { usuarioId: id, isNotAdmin: false}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Handle the result after the dialog is closed
      console.log('The dialog was closed', result);

      if (result === 'updated') {

        this.noti.mensaje('',
        'Usuario actualizado',
        TipoMessage.success)

        this.listaUsuarios()
      }else if (result==='updatedpassword'){
        this.noti.mensaje('',
        'Contraseña actualizada',
        TipoMessage.success)

        this.listaUsuarios()
      }
    });

  }



}
