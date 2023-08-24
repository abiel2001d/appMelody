import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notificacion.service';

@Component({
  selector: 'app-usuario-login',
  templateUrl: './usuario-login.component.html',
  styleUrls: ['./usuario-login.component.css']
})
export class UsuarioLoginComponent {
  hide=true;
  formulario: FormGroup;
  makeSubmit: boolean = false;
  infoUsuario: any;
  roleSelected: any
  constructor(
    public fb: FormBuilder,
    private authService: AuthenticationService,
    private notificacion: NotificacionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.reactiveForm();
  }
  // Definir el formulario con su reglas de validación
  reactiveForm() {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.mensajes();
    this.authService.currentSelectedRole.subscribe((valor)=>(this.roleSelected=valor));
  }

  mensajes() {
   let register=false;
   let auth='';
   //Obtener parámetros de la URL
   this.route.queryParams.subscribe((params)=>{
    register=params['register']==='true' || false;
    auth=params['auth'] || '';
    if(register){
      this.notificacion.mensaje(
        '',
        'Usuario registrado exitosamente',
         TipoMessage.success)
    }
    if(auth){
      this.notificacion.mensaje(
        '',
        'Acceso denegado',
        TipoMessage.warning
      )
    }
   })
   
  }
  onReset() {
    this.formulario.reset();
  }
  submitForm() {
    this.makeSubmit = true;
    // Validación
    if (this.formulario.invalid) {
      return;
    }
  
    this.authService.loginUser(this.formulario.value)
      .subscribe({
        next: (respuesta: any) => {

          if(this.roleSelected==3){
            this.router.navigate(['/']);
          }else{
            this.router.navigate(['/pedido/dashboard']);
          }
         

        },
        error: (error: any) => {
          if (error.status === 401) {
            this.notificacion.mensaje(
              '',
              'Acceso denegado',
              TipoMessage.error
            )
          } 
        }
      });
  }
  

  public errorHandling = (control: string, error: string) => {
    return (
      this.formulario.controls[control].hasError(error) &&
      this.formulario.controls[control].invalid &&
      (this.makeSubmit || this.formulario.controls[control].touched)
    );
  }
}
