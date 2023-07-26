import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

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

  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private router: Router,
    private activeRouter: ActivatedRoute
  ){
    this.formularioReactive()
  }


  ngOnInit(): void {
    this.activeRouter.params.subscribe((params: Params) => {
      this.idMetodoPago = params['id'];
      if (this.idMetodoPago !== undefined) {
        this.isCreate = false;
        this.gService.get('metodoPago', this.idMetodoPago)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.metodoPagoInfo = data;
            
  
            // Initialize the imagenes control as an empty array
            this.metodoPagoForm.setValue({
              id: this.metodoPagoInfo.id,
              numTajeta: this.metodoPagoInfo.numTajeta,
              fechaVenc: this.metodoPagoInfo.fechaVenc,
              codSeguridad: this.metodoPagoInfo.codSeguridad,
              tipo: this.metodoPagoInfo.tipo,
              usuario: this.metodoPagoInfo.usuarioId,
            });
            
          });
      }
    });

    let user={
      id:462578415,
      rol: 2
    }
    this.currentUser=user;
  }

  
  formularioReactive() {
    this.metodoPagoForm = this.fb.group({
      id: [null],
      numTajeta: [null, Validators.compose([
        Validators.required, Validators.minLength(16)
      ])],
      fechaVenc: [null, Validators.compose([
        Validators.required
      ])],
      codSeguridad: [null, Validators.compose([
        Validators.required
      ])],
      tipo: [true, Validators.required],
      categoria: [null, Validators.required],
      productoEstado: [null, Validators.required],
      usuario: [null, null],
      
    });
  }

  public errorHandling = (control: string, error: string) => {
    return this.metodoPagoForm.controls[control].hasError(error);
  };


  //Crear 
  crearMetodoPago(): void {
    this.submitted = true;
    
    this.metodoPagoForm.patchValue({
      usuario: this.currentUser.id
    });
      //metodoPagoForm validación
    if(this.metodoPagoForm.invalid){
      return;
    }
  
      console.log(this.metodoPagoForm.value);
      this.gService.create('metodoPago', this.metodoPagoForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respMetodoPago = data;
          this.router.navigate(['/metodoPago'], {
            queryParams: { create: 'true' }
          });
        });
    
  }
  //Actualizar 
  actualizarMetodoPago() {
    //Establecer submit verdadero
    this.submitted=true;

    this.metodoPagoForm.patchValue({
      usuario: this.currentUser.id
    });
  

    //Verificar validación
    if(this.metodoPagoForm.invalid){
      return;
    }
    
    
    console.log(this.metodoPagoForm.value);
    //Accion API create enviando toda la informacion del formulario
    this.gService.update('metodoPago',this.metodoPagoForm.value)
    .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {
      //Obtener respuesta
      this.respMetodoPago=data;
      this.router.navigate(['/metodoPago'],{
        queryParams: {update:'true'}
      });
    });
  }



  ngOnDestroy() {
    this.destroy$.next(true);
    // Desinscribirse
    this.destroy$.unsubscribe();
  }

}
