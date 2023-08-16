import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notificacion.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-usuario-create',
  templateUrl: './usuario-create.component.html',
  styleUrls: ['./usuario-create.component.css']
})
export class UsuarioCreateComponent implements OnInit {
  hide = true;
  usuario: any;
  roles: any;
  formCreate: FormGroup;
  makeSubmit: boolean = false;
  proveedorSelected: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private authService: AuthenticationService,
    private noti: NotificacionService,
  ) {
    this.reactiveForm();
  }

  reactiveForm() {
    this.formCreate = this.fb.group({
      id: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      telefono: ['', [Validators.required]],
      proveedor: ['', null],
      password: ['', [Validators.required,Validators.minLength(8),Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
      estado: [true, null],
      roles: ['', [Validators.required]],
    });
    this.getRoles();
  }
  ngOnInit(): void {
    // Listen to changes in the "roles" form control
    this.formCreate.get('roles')?.valueChanges.subscribe((selectedRoles) => {
      // Check if the selected role ID includes 2
      if (selectedRoles.includes(2)) {
        this.proveedorSelected=true
        this.formCreate.get('proveedor')?.setValidators([Validators.required]);
        this.formCreate.get('proveedor')?.updateValueAndValidity();
      } else {
        this.proveedorSelected=false
        this.formCreate.get('proveedor')?.clearValidators();
        this.formCreate.get('proveedor')?.updateValueAndValidity();
      }
    });
  }

  submitForm() {
    this.makeSubmit = true;

    // Validación
    if (this.formCreate.invalid) {
        return;
    }

    let gFormat: any = this.formCreate.get('roles').value.map(x => ({ ['id']: x }))
    this.formCreate.patchValue({ roles: gFormat });
    this.formCreate.get('id').setValue(parseInt(this.formCreate.get('id').value, 10));

    const idCheck$ = this.gService.get('usuario', this.formCreate.get('id').value);
    const emailCheck$ = this.gService.get('usuario/email', this.formCreate.get('email').value);

    forkJoin([idCheck$, emailCheck$])
        .pipe(takeUntil(this.destroy$))
        .subscribe(([idResponse, emailResponse]) => {
            if (idResponse != null) {
                this.noti.mensaje('', 'Cédula ya está registrada', TipoMessage.error);
                return;
            }

            if (emailResponse != null) {
                this.noti.mensaje('', 'Correo ya está registrado', TipoMessage.error);
                return;
            }

            this.authService.createUser(this.formCreate.value)
                .subscribe((respuesta: any) => {
                    this.usuario = respuesta;

                    this.router.navigate(['/usuario/login'], {
                        queryParams: { register: 'true' },
                    });
                });
        });
}



  onReset() {
    this.formCreate.reset();
  }
  getRoles() {
    this.gService
      .list('rol')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.roles = data.filter((role: any) => role.id !== 1);
        console.log(this.roles);
      });
  }
  public errorHandling = (control: string, error: string) => {
    return (
      this.formCreate.controls[control].hasError(error) &&
      this.formCreate.controls[control].invalid &&
      (this.makeSubmit || this.formCreate.controls[control].touched)
    );
  };

}
