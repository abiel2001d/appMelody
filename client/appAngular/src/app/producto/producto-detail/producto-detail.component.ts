import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { ProductoDialogComponent } from '../producto-dialog/producto-dialog.component';
import { NotificacionService, TipoMessage } from 'src/app/share/notificacion.service';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Component({
  selector: 'app-producto-detail',
  templateUrl: './producto-detail.component.html',
  styleUrls: ['./producto-detail.component.css']
})
export class ProductoDetailComponent {
  currentDialogIndex = 0;
  currentDialog: number = 0;
  currentUser:any
  submitted = false;
  comentarioForm: FormGroup;
  datos:any;//Guarda la respuesta del API
  destroy$: Subject<boolean>=new Subject<boolean>();
  estadoInventario:string
  roleSelected:any
  constructor(
    private gService: GenericService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private noti: NotificacionService,
    private authService: AuthenticationService 
    ){
      //Obtener el parámetro
      let id=this.route.snapshot.paramMap.get('id');
      if(!isNaN(Number(id))){
        this.obtenerProducto(id);
      }
      this.formularioReactive() 
  }
  ngOnInit(): void {
    this.authService.currentUser.subscribe((x)=>(this.currentUser=x));
    this.authService.currentSelectedRole.subscribe((valor)=>(this.roleSelected=valor));

  }
  public errorHandling = (control: string, error: string) => {
    return this.comentarioForm.controls[control].hasError(error);
  };

  //Crear Formulario
  formularioReactive() {
    //[null, Validators.required]
    this.comentarioForm=this.fb.group({
      //Input type hidden
      contenido: [null, null],
      tipo:[null,null],
      dialogo:[null,null],
      usuario:[null,null]
    })
   
  }

  prevDialog() {
    if (this.currentDialog > 0) {
      this.currentDialog--;
    }
  }

  nextDialog() {
    if (this.currentDialog < this.datos.dialogos.length - 1) {
      this.currentDialog++;
    }
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

  obtenerProducto(id:any){
    this.gService
    .get('producto',id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any)=>{
      console.log(data);
        this.datos=data; 
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

  enviarMensaje(idDialogo: any) {
    this.submitted = true;
    
    if(this.comentarioForm.get("contenido").value===null){
      this.noti.mensaje('',
      'Comentario no enviado, no puede estar vacío',
      TipoMessage.error)
      return;
    }else if (this.comentarioForm.get("contenido").value.length<2) {
      this.noti.mensaje('',
      'Comentario no enviado, se requieren 2 caracteres mínimo',
      TipoMessage.error)
      return;
    }

    this.comentarioForm.patchValue({ 
      dialogo: idDialogo,
      usuario: this.currentUser.user.id,
      tipo: this.roleSelected
    });
  
    console.log(this.comentarioForm.value);
    this.gService.create('comentario', this.comentarioForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.noti.mensaje('',
          'Comentario enviado con éxito',
          TipoMessage.success)

        let id = this.route.snapshot.paramMap.get('id'); 
        this.obtenerProducto(id)
        this.comentarioForm.reset()
      });
    
  }

  previousDialog() {
    if (this.currentDialogIndex > 0) {
      this.currentDialogIndex--;
    }
  }

  openCreateDialog(productoId: number, usuarioId: number): void {
    const dialogRef = this.dialog.open(ProductoDialogComponent, {
      width: '800px',
      data: { productoId: productoId, usuarioId: usuarioId } // Initial data for the dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Handle the result after the dialog is closed
      console.log('The dialog was closed', result);

      if (result === 'created') {

        this.noti.mensaje('',
        'Nuevo conversación ha sido creada',
        TipoMessage.success)

        let id = this.route.snapshot.paramMap.get('id'); // Obtain the ID from the current URL
        this.obtenerProducto(id)
      }
    });
  }
  


}
