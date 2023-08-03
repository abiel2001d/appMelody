import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notificacion.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit{
  isAutenticated: boolean;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private notificacion: NotificacionService,
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe((valor) => (this.isAutenticated = valor));
    this.mensajes()
  }

  mensajes() {
    let auth='';
    //Obtener parámetros de la URL
    this.route.queryParams.subscribe((params)=>{
     auth=params['auth'] || '';
     if(auth){
       this.notificacion.mensaje(
         '',
         'Acceso denegado',
         TipoMessage.warning
       )
     }
    })
   }
}
