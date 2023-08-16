import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { MetodoPagoService } from 'src/app/share/metodoPago.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notificacion.service';

@Component({
  selector: 'app-metodo-pago-form',
  templateUrl: './metodo-pago-form.component.html',
  styleUrls: ['./metodo-pago-form.component.css']
})
export class MetodoPagoFormComponent{
  destroy$: Subject<boolean> = new Subject<boolean>();
  //Respuesta del API crear/modificar
  respMetodoPago: any;
  submitted = false;
  //Nombre del formulario
  metodoPagoForm: FormGroup;
  metodoPagoInfo: any;
  currentUser:any
  idMetodoPago: number = 0;
  //Sí es crear
  isCreate: boolean = true;
  selectedObj:any

  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private noti: NotificacionService,
    private authService: AuthenticationService,
    private metodoPagoService: MetodoPagoService
  ){
    this.formularioReactive()
  }


  ngOnInit(): void {
    this.metodoPagoService.selectedObj$.subscribe((value) => {
      if (value !== undefined || value !==null) {
        this.isCreate = false;
        this.metodoPagoInfo=value
        console.log(value);
        this.metodoPagoForm.patchValue({
          id: this.metodoPagoInfo.id,
          numTajeta: this.metodoPagoInfo.numTajeta,
          fechaVenc: this.metodoPagoInfo.fechaVenc,
          codSeguridad: this.metodoPagoInfo.codSeguridad,
          tipo: this.metodoPagoInfo.tipo,
          usuario: this.metodoPagoInfo.usuarioId,
        });
       
          console.log(this.metodoPagoForm.value)
      }
    });
    this.authService.currentUser.subscribe((x)=>(this.currentUser=x));
  }

  
  formularioReactive() {
    this.metodoPagoForm = this.fb.group({
      id: [null,null],
      numTajeta: [null,null],
      fechaVenc: [null,null],
      codSeguridad: [null,null],
      tipo: [null,null],
      usuario: [null,null],
      
    });
  }

  public errorHandling = (control: string, error: string) => {
    return this.metodoPagoForm.controls[control].hasError(error);
  };


  crearMetodoPago(): void {
    this.submitted = true;
  
    this.metodoPagoForm.patchValue({
      usuario: this.currentUser.user.id
    });
  
    let hasNullValue = false;
  
    Object.keys(this.metodoPagoForm.controls).forEach(controlName => {
      if (controlName !== 'id') { // Exclude 'id' from validation
        const control = this.metodoPagoForm.get(controlName) as FormControl;
        if (control.value === null  || control.value === "" ) {
          hasNullValue = true;
        }
      }
    });
  
    if (hasNullValue) {
      this.noti.mensaje(
        '',
        'Información Incompleta',
        TipoMessage.error
      );
      this.submitted = false;
      return; // Exit the function without proceeding to create
    }
  
    console.log(this.metodoPagoForm.value);
    this.gService.create('metodoPago', this.metodoPagoForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.respMetodoPago = data;
        this.metodoPagoForm.reset();
        this.submitted = false;
        this.noti.mensaje('',
          'Método de pago creado',
          TipoMessage.success)
          this.metodoPagoService.refeshData()
      });
  }
  
  //Actualizar 
  actualizarMetodoPago() {
    //Establecer submit verdadero
    this.submitted=true;

    this.metodoPagoForm.patchValue({
      usuario: this.currentUser.user.id
    });
  

    let hasNullValue = false;
  
    Object.keys(this.metodoPagoForm.controls).forEach(controlName => {
      
      const control = this.metodoPagoForm.get(controlName) as FormControl;
      if (control.value === null  || control.value === "" ) {
        hasNullValue = true;
      }
      
    });
  
    if (hasNullValue) {
      this.noti.mensaje(
        '',
        'Información Incompleta',
        TipoMessage.error
      );
      this.submitted = false;
      return; // Exit the function without proceeding to create
    }
  
    this.gService.update('metodoPago', this.metodoPagoForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.respMetodoPago = data;
        this.metodoPagoForm.reset();
        this.submitted = false;
        this.isCreate=true;
        this.noti.mensaje('',
          'Método de pago actualizado',
          TipoMessage.success)
          this.metodoPagoService.refeshData()
      });
  }



  ngOnDestroy() {
    this.destroy$.next(true);
    // Desinscribirse
    this.destroy$.unsubscribe();
  }


  reset(event: Event): void {
    event.preventDefault();
    this.metodoPagoForm.reset();
    this.submitted = false;
    this.isCreate=true;
  }
  
}
