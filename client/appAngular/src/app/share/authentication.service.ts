import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  //Header para afirmar el tipo de contenido JSON
  //URL del API
  ServerUrl = environment.apiURL;
  //Variable observable para gestionar la información del usuario, con características especiales
  private currentUserSubject: BehaviorSubject<any>;
  //Variable observable para gestionar la información del usuario
  public currentUser: Observable<any>;
  //Booleano para estado de usuario autenticado
  private authenticated = new BehaviorSubject<boolean>(false);
  //Inyectar cliente HTTP para las solicitudes al API
  private selectedRole = new BehaviorSubject<number>(0);
  private multiRol = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private cartService: CartService) {
    //Obtener los datos del usuario en localStorage, si existe
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    //Establecer un observable para acceder a los datos del usuario
    this.currentUser = this.currentUserSubject.asObservable();
    const currentUserData = JSON.parse(localStorage.getItem('currentUser'));
    // If currentUser data exists and contains currentRoleSelected attribute, set the initial role
    if (currentUserData && 'currentRoleSelected' in currentUserData && 'multiRol' in currentUserData) {
      this.setSelectedRole(currentUserData.currentRoleSelected);
      this.multiRol.next(currentUserData.multiRol)
    }
  }
  //Obtener el valor del usuario actual
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  //Establecer booleano verificando si esta autenticado
  get isAuthenticated() {
    if (this.currentUserValue != null) {
      this.authenticated.next(true);
    } else {
      this.authenticated.next(false);
    }
    return this.authenticated.asObservable();
  }
  //Crear usuario
  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.ServerUrl + 'usuario/registrar', user);
  }

  updateUserName(newName: string): void {
  const currentUserData = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUserData) {
    currentUserData.user.nombre = newName;
    localStorage.setItem('currentUser', JSON.stringify(currentUserData));
    this.currentUserSubject.next(currentUserData);
  }
}
  //Login
  loginUser(user: any): Observable<any> {
    return this.http.post<any>(this.ServerUrl + 'usuario/login', user).pipe(
      map((user) => {
        // almacene los detalles del usuario y el token jwt
        // en el almacenamiento local para mantener al usuario conectado entre las actualizaciones de la página
        localStorage.setItem('currentUser', JSON.stringify(user.data));
        let currentUserData = JSON.parse(localStorage.getItem('currentUser'));
        // Check the number of roles the user has
        const roles = user.data.user.roles;
        if (roles.length === 1) {
          this.setSelectedRole(roles[0].id);
          this.multiRol.next(false);
          currentUserData.currentRoleSelected = roles[0].id
          currentUserData.multiRol = false
        } else {
          this.setSelectedRole(3);
          this.multiRol.next(true);
          currentUserData.currentRoleSelected = 3
          currentUserData.multiRol = true
        }
        localStorage.setItem('currentUser', JSON.stringify(currentUserData));
        this.authenticated.next(true);
        this.currentUserSubject.next(user.data);
        return user;
      })
    );
  }
  //Logout de usuario autentificado
  logout() {
    let usuario = this.currentUserSubject.value;
    if (usuario) {
      // eliminar usuario del almacenamiento local para cerrar la sesión del usuario
      localStorage.removeItem('currentUser');
      //Eliminarlo del observable del usuario actual
      this.currentUserSubject.next(null);
      //Eliminarlo del observable del boleano si esta autenticado
      this.authenticated.next(false);
      //Eliminar carrito
      this.selectedRole.next(0)
      this.cartService.deleteCart();
      return true;
    }
    return false;
  }

  // Method to set the selected role and notify subscribers
  setSelectedRole(role: number): void {
    let currentUserData = JSON.parse(localStorage.getItem('currentUser'));
    // If currentUser data exists and contains currentRoleSelected attribute, set the initial role
    if (currentUserData && 'currentRoleSelected' in currentUserData) {
      currentUserData.currentRoleSelected=role
    }
    localStorage.setItem('currentUser', JSON.stringify(currentUserData));
    this.selectedRole.next(role);
  }

  currentRol(){
    return this.selectedRole.getValue();
  }

  get isMultiRol() {
    return this.multiRol.asObservable();
  }
  get currentSelectedRole() {
    return this.selectedRole.asObservable();
  }
}
