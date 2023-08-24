import { Component, Inject,OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notificacion.service';
import { catchError, finalize } from 'rxjs/operators';
import { EMPTY } from 'rxjs';



@Component({
  selector: 'app-evaluacion-dialog',
  templateUrl: './evaluacion-dialog.component.html',
  styleUrls: ['./evaluacion-dialog.component.css']
})
export class EvaluacionDialogComponent {
  currentUser:any
  roleSelected:any
 
  disabled = false;
  max = 5;
  min = 1;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  datosDialog:any
  evaluaciones: Evaluacion[] = [];
  evaluacionesProveedor:any
  evaluacionesCliente:any
  destroy$: Subject<boolean>=new Subject<boolean>();
  pedidoEvaluadoPorCliente =false
  pedidoEvaluadoPorProveedor = false

  constructor(
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef:MatDialogRef<EvaluacionDialogComponent>,
    private gService:GenericService,
    private router: Router,
    private authService: AuthenticationService,
    private activeRouter: ActivatedRoute,
    private noti: NotificacionService
  ) { 
    //this.reactiveForm();
    this.datosDialog=data;
  }


ngOnInit(): void {
  this.authService.currentUser.subscribe((x)=>(this.currentUser=x));
  this.authService.currentSelectedRole.subscribe((valor)=>(this.roleSelected=valor));
 
  


  if(this.roleSelected==3){ // Cliente evaluando proveedores
    
    this.pedidoEvaluadoPorProveedor = this.datosDialog.pedido.evaluaciones
    .find( x=>x.realizadoPor==2)
    if(this.pedidoEvaluadoPorProveedor){
      this.evaluacionesProveedor = this.datosDialog.pedido.evaluaciones.filter((evaluacion) => {
        return evaluacion.realizadoPor == 2;
      });
    }

    this.pedidoEvaluadoPorCliente = this.datosDialog.pedido.evaluaciones
    .find( x=>x.realizadoPor==3)


    if(this.pedidoEvaluadoPorCliente){
      this.evaluacionesCliente =  this.datosDialog.pedido.evaluaciones.filter((evaluacion) => {
        return evaluacion.realizadoPor == 3;
      });
      console.log(this.evaluaciones)
    }else{
      this.datosDialog.pedido.productos.forEach((producto: any) => {
        const newSurvey: Evaluacion = {
          proveedor: producto.producto.proveedor.id,
          proveedorNombre: producto.producto.proveedor.proveedor,
          pedido: this.datosDialog.pedido.id,
          realizadoPor: this.roleSelected,  
          comentrario: "",
          puntaje:1     
        };
        if(!this.evaluaciones.find(x=>x.proveedor==newSurvey.proveedor)){
          this.evaluaciones.push(newSurvey);
        }
      });
  
    }
    


  
  }
  else{ // Proveedor evaluando cliente
 
  this.pedidoEvaluadoPorProveedor = this.datosDialog.pedido.evaluaciones
    .find( x=>x.realizadoPor==2 && x.proveedor.id==this.currentUser.user.id)
   
    this.pedidoEvaluadoPorCliente = this.datosDialog.pedido.evaluaciones
    .find( x=>x.realizadoPor==3  && x.proveedor.id==this.currentUser.user.id)


    if(this.pedidoEvaluadoPorCliente){
      this.evaluacionesCliente =  this.datosDialog.pedido.evaluaciones.filter((evaluacion) => {
        return (evaluacion.realizadoPor == 3 && evaluacion.proveedor.id==this.currentUser.user.id);
      });
      console.log(this.evaluaciones)
    }
    
    if(this.pedidoEvaluadoPorProveedor){
      this.evaluacionesProveedor = this.datosDialog.pedido.evaluaciones.filter((evaluacion) => {
        return (evaluacion.realizadoPor == 2 && evaluacion.proveedor.id==this.currentUser.user.id);
      });
    }else{
      
        const newSurvey: Evaluacion = {
          proveedor: this.currentUser.user.id,
          proveedorNombre:  this.datosDialog.pedido.usuario.nombre,
          pedido: this.datosDialog.pedido.id,
          realizadoPor: this.roleSelected,  
          comentrario: "",
          puntaje:1     
        };
        this.evaluaciones.push(newSurvey);
      
  
    }





  }

}




enviarEvaluacion() {
  const createObservables = this.evaluaciones.map((evaluacion: any) => {
    return this.gService.create("evaluacion", evaluacion)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          // Handle error if necessary
          this.noti.mensaje('', "Ocurrió un error", TipoMessage.error);
          return EMPTY; // Return an empty observable to cancel further processing
        })
      );
  });

  forkJoin(createObservables)
    .subscribe({
      next: () => {
        this.noti.mensaje('', this.evaluaciones.length>1 ? "Evaluaciones enviadas con éxito": "Evaluación enviada con éxito", TipoMessage.success);
        this.dialogRef.close('created');  
      },
      error: error => {
        // Handle error if necessary
        console.error("Error creating evaluations:", error);
      }
    });
}

}
interface Evaluacion {
  proveedor: number;
  proveedorNombre: string;
  pedido: number;
  realizadoPor: number;
  puntaje: number;
  comentrario:  string 
}
