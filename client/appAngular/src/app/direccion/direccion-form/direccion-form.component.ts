import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { DireccionService } from 'src/app/share/direccion.service';
import { GenericService } from 'src/app/share/generic.service';
import { LocationService } from 'src/app/share/location.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notificacion.service';

@Component({
  selector: 'app-direccion-form',
  templateUrl: './direccion-form.component.html',
  styleUrls: ['./direccion-form.component.css']
})
export class DireccionFormComponent implements OnInit {
  provinces: any[];
  cantons: any[];
  distritos: any[];
  selectedProvince: string;
  selectedCanton: string;
  selectedDistrito: string;
  postalCode: string;
  destroy$: Subject<boolean>=new Subject<boolean>();

  //Respuesta del API crear/modificar
  respMetodoPago: any;
  submitted = false;
  //Nombre del formulario
  direccionForm: FormGroup;
  direccionInfo: any;
  currentUser:any
  idDireccion: number = 0;
  //Sí es crear
  isCreate: boolean = true;
  selectedObj:any

  
  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private gService: GenericService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private noti: NotificacionService,
    private authService: AuthenticationService,
    private direccionService: DireccionService
    ) { 
      this.formularioReactive()
    }
  
    formularioReactive() {
      this.direccionForm = this.fb.group({
        id: [null,null],
        provincia: [null,null],
        canton: [null,null],
        distrito: [null,null],
        provinciaDesc:   [null,null],
        cantonDesc:   [null,null],
        distritoDesc:   [null,null],
        exacta: [null,null],
        codigoPostal: [null,null],
        telefono: [null,null],
        usuario: [null,null],
      });
    }
  
    ngOnInit() {

    this.authService.currentUser.subscribe((x)=>(this.currentUser=x));

    this.locationService.getProvinces()
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
        this.provinces = Object.entries(data).map(([key, value]) => ({ key, value }));
        });
    
    this.direccionService.selectedObj$.subscribe((value) => {
      if (value !== undefined || value !==null) {
        this.isCreate = false;
        this.direccionInfo=value
        console.log(value);

       
        this.locationService.getCantons(this.direccionInfo.provincia.toString())
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
        this.cantons = Object.entries(data).map(([key, value]) => ({ key, value }));
    
        });
        this.locationService.getDistricts(this.direccionInfo.provincia.toString(), this.direccionInfo.canton.toString())
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
        this.distritos = Object.entries(data).map(([key, value]) => ({ key, value }));
        });

        this.direccionForm.patchValue({
          id: this.direccionInfo.id,
          provincia:  this.direccionInfo.provincia.toString(),
          canton:  this.direccionInfo.canton.toString(),
          distrito:  this.direccionInfo.distrito.toString(),
          codigoPostal:  this.direccionInfo.codigoPostal.toString(),
          telefono: this.direccionInfo.telefono,
          exacta: this.direccionInfo.exacta,
        });

          console.log(this.direccionForm.value)
      }
    });


    this.authService.currentUser.subscribe((x)=>(this.currentUser=x));
    }


  
    onProvinceChange() {
    this.locationService.getCantons(this.selectedProvince)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
    this.cantons = Object.entries(data).map(([key, value]) => ({ key, value }));
    this.updatePostalCode();
    });
    }
  
    onCantonChange() {
    this.locationService.getDistricts(this.selectedProvince, this.selectedCanton)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
    this.distritos = Object.entries(data).map(([key, value]) => ({ key, value }));
    this.updatePostalCode();
    });
    }
  
    onDistritoChange() {
      this.updatePostalCode();
    }
  
    private updatePostalCode() {
      const format = (value: string, length: number): string => {
        if (value && value.length === length) {
          return value;
        } else if (value && value.length === 1) {
          return '0' + value;
        } else {
          return length === 1 ? '0' : '00';
        }
      };
  
      this.postalCode =
        format(this.selectedProvince, 1) +
        format(this.selectedCanton, 2) +
        format(this.selectedDistrito, 2);
    }
    ngOnDestroy(){
      this.destroy$.next(true);
      this.destroy$.unsubscribe();
    }

    crearMetodoPago(): void {
      this.submitted = true;
    
      this.direccionForm.patchValue({
        usuario: this.currentUser.user.id
      });

      this.direccionForm.patchValue({
        provinciaDesc:   (this.provinces.find(x=>x.key===this.direccionForm.value.provincia.toString())).value,
        cantonDesc:  (this.cantons.find(x=>x.key===this.direccionForm.value.canton.toString())).value,
        distritoDesc:   (this.distritos.find(x=>x.key===this.direccionForm.value.distrito.toString())).value,
      });
    
      let hasNullValue = false;
    
      Object.keys(this.direccionForm.controls).forEach(controlName => {
        if (controlName !== 'id') { // Exclude 'id' from validation
          const control = this.direccionForm.get(controlName) as FormControl;
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
        return;
      }

       
      const provincia = parseInt(this.direccionForm.value.provincia, 10);
      const canton = parseInt(this.direccionForm.value.canton, 10);
      const distrito = parseInt(this.direccionForm.value.distrito, 10);
      const codigoPostal = parseInt(this.direccionForm.value.codigoPostal, 10);

      this.direccionForm.patchValue({
        provincia: provincia,
        canton: canton,
        distrito: distrito,
        codigoPostal: codigoPostal
      });
    
      console.log(this.direccionForm.value);
      this.gService.create('direccion', this.direccionForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respMetodoPago = data;
          this.direccionForm.reset();
          this.submitted = false;
          this.noti.mensaje('',
          'Dirección agregada',
          TipoMessage.success)
          this.direccionService.refeshData()
        });
    }
    
    //Actualizar 
    actualizarMetodoPago() {
      //Establecer submit verdadero
      this.submitted=true;
  
      this.direccionForm.patchValue({
        usuario: this.currentUser.user.id
      });
      this.direccionForm.patchValue({
        provinciaDesc:   (this.provinces.find(x=>x.key===this.direccionForm.value.provincia.toString())).value,
        cantonDesc:  (this.cantons.find(x=>x.key===this.direccionForm.value.canton.toString())).value,
        distritoDesc:   (this.distritos.find(x=>x.key===this.direccionForm.value.distrito.toString())).value,
      });
  
      let hasNullValue = false;
    
      Object.keys(this.direccionForm.controls).forEach(controlName => {
        
        const control = this.direccionForm.get(controlName) as FormControl;
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

      const provincia = parseInt(this.direccionForm.value.provincia, 10);
      const canton = parseInt(this.direccionForm.value.canton, 10);
      const distrito = parseInt(this.direccionForm.value.distrito, 10);
      const codigoPostal = parseInt(this.direccionForm.value.codigoPostal, 10);

      this.direccionForm.patchValue({
        provincia: provincia,
        canton: canton,
        distrito: distrito,
        codigoPostal: codigoPostal
      });

      
      this.gService.update('direccion', this.direccionForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respMetodoPago = data;
          this.direccionForm.reset();
          this.submitted = false;
          this.isCreate=true;
          this.noti.mensaje('',
          'Dirección actualizada',
          TipoMessage.success)
          this.direccionService.refeshData()
        });
    }
  
  
    reset(event: Event): void {
      event.preventDefault();
      this.direccionForm.reset();
      this.submitted = false;
      this.isCreate=true;
    }
  }