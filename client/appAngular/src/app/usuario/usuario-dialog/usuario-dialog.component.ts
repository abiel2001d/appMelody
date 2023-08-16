import { Component, Inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notificacion.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.css']
})
export class UsuarioDialogComponent {
  datos:any;
  datosDialog:any;
  destroy$:Subject<boolean>= new Subject<boolean>();
  roles: any;
  usuarioForm: FormGroup;
  passwordForm: FormGroup;
  submitted = false;
  makeSubmit: boolean = false;
  proveedorSelected: boolean = false;
  hide = true;
  currentUser:any
  constructor(
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef:MatDialogRef<UsuarioDialogComponent>,
    private gService:GenericService,
    private router: Router,
    private authService: AuthenticationService,
    private activeRouter: ActivatedRoute,
    private noti: NotificacionService,
  ) { 
    this.reactiveForm();
    this.datosDialog=data;
  }

  reactiveForm() {
    this.usuarioForm = this.fb.group({
      id: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      proveedor: ['', null],
      password: ['', [Validators.required]],
      estado: [true, null],
      roles: ['', [Validators.required]],
    });
    this.getRoles();

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required,Validators.minLength(8),Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
      id: [null, null],
    });

  }

  

  ngOnInit(): void {
    this.authService.currentUser.subscribe((x)=>(this.currentUser=x));
    // Listen to changes in the "roles" form control
    this.usuarioForm.get('roles')?.valueChanges.subscribe((selectedRoles) => {
      // Check if the selected role ID includes 2
      if (selectedRoles.includes(2)) {
        this.proveedorSelected=true
        this.usuarioForm.get('proveedor')?.setValidators([Validators.required]);
        this.usuarioForm.get('proveedor')?.updateValueAndValidity();
      } else {
        this.proveedorSelected=false
        this.usuarioForm.get('proveedor')?.clearValidators();
        this.usuarioForm.get('proveedor')?.updateValueAndValidity();
      }
    });
  
      this.gService
      .get('usuario',this.datosDialog.usuarioId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
          this.datos=data; 
          console.log(this.datos)
          this.usuarioForm.setValue({
          id: this.datos.id,
          nombre: this.datos.nombre,
          email: this.datos.email,
          telefono: this.datos.telefono,
          proveedor: this.datos.proveedor,
          password: this.datos.password,
          estado: this.datos.estado,
          roles:this.datos.roles.map(({id}) => id)
        });
        console.log(this.usuarioForm.value)
    });
  }
  getRoles() {
    this.gService
      .list('rol')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.roles = data;
        console.log( this.roles);
      });
  }
  close(){
    //Dentro de close ()
     //this.form.value 
    this.dialogRef.close();
  }
  actualizarUsuario() {
    if (this.usuarioForm.invalid) {
      return;
    }
    let gFormat:any=this.usuarioForm.get('roles').value.map(x=>({['id']: x}))
    this.usuarioForm.patchValue({roles: gFormat});
  
    console.log(this.usuarioForm.value);

    this.gService.update('usuario', this.usuarioForm.value)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
        // Close the dialog and indicate that a new dialog was created
        if(this.usuarioForm.get('id').value===this.currentUser.user.id){
          this.authService.updateUserName(this.usuarioForm.get('nombre').value);
        }
        
        this.dialogRef.close('updated');  
    });

  }

  public errorHandling = (control: string, error: string) => {
    return (
      this.usuarioForm.controls[control].hasError(error) &&
      this.usuarioForm.controls[control].invalid &&
      (this.makeSubmit || this.usuarioForm.controls[control].touched)
    );
  };

  public errorHandlingPassword = (control: string, error: string) => {
    return (
      this.passwordForm.controls[control].hasError(error) &&
      this.passwordForm.controls[control].invalid &&
      (this.makeSubmit || this.passwordForm.controls[control].touched)
    );
  };

  actualizarPassword(){
    if (this.passwordForm.invalid) {
      return;
    }
    this.passwordForm.patchValue({id: this.datos.id});
  
    console.log(this.passwordForm.value);
    this.gService.update('usuario/password', this.passwordForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
          // Close the dialog and indicate that a new dialog was created
          this.dialogRef.close('updatedpassword');  
      });
  }
}
