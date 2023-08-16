import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notificacion.service';
import { UsuarioDialogComponent } from 'src/app/usuario/usuario-dialog/usuario-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isAutenticated: boolean;
  currentUser: any;
  roleSelected:any
  constructor(private router: Router,private authService: AuthenticationService,
    public dialog: MatDialog,
    private noti: NotificacionService,){
  }
  ngOnInit(): void {
    
    this.authService.currentUser.subscribe((x)=>(this.currentUser=x));
    this.authService.isAuthenticated.subscribe((valor)=>(this.isAutenticated=valor));
    this.authService.currentSelectedRole.subscribe((valor)=>(this.roleSelected=valor));

  } 

  login(){
    this.router.navigate(['usuario/login']);
  }
  logout(){
    this.authService.logout();
    this.router.navigate(['inicio']);
  }
  
  actualizarUsuario() {
    
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '900px',
      data: { usuarioId: this.currentUser.user.id,isNotAdmin: true}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Handle the result after the dialog is closed
      console.log('The dialog was closed', result);

      if (result === 'updated') {

        this.noti.mensaje('',
        'Usuario actualizado',
        TipoMessage.success)

        //this.listaUsuarios()
      }else if (result==='updatedpassword'){
        this.noti.mensaje('',
        'Contraseña actualizada',
        TipoMessage.success)

        //this.listaUsuarios()
      }
    });
  }
}
