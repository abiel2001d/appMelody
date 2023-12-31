import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isAuthenticated:boolean;
  currentUser: any;
  roleSelected:any
  constructor(private authService:AuthenticationService, 
    private router: Router) {
      //Subscribirse para obtener si esta autenticado
      this.authService.isAuthenticated.subscribe(
        (valor) => (this.isAuthenticated = valor)
      );
      //Subscribirse para obtener el usuario autenticado
      this.authService.currentUser.subscribe((x) => (this.currentUser = x));
      this.authService.currentSelectedRole.subscribe((valor)=>(this.roleSelected=valor));
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let url: string = state.url;
      return this.checkUserLogin(route, url);
      
  }
  //Verificar que el rol del usuario coincida
  //con alguno de los indicados
  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    if (this.isAuthenticated) {
      const userRole = this.roleSelected;
      //roles.length && roles.indexOf(verify.role)===-1
      if(route.data['roles'].length && !route.data['roles'].includes(userRole)){ 
        this.router.navigate(['/'], {
          //Parametro para mostrar mensaje en login
          queryParams: { auth: 'no' }
        });
        return false;
      }
      return true;
    } 

    if (/^\/producto(\/\d+)?$/.test(url)) {
      return true;
    }
    

    this.router.navigate(['/usuario/login'], {
      queryParams: { auth: 'no'}
    });
    return false;
  }
}