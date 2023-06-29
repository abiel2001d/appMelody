import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isAutenticated:boolean;
  currentUser:any;
  constructor(private router: Router){
  }
  ngOnInit(): void {
    //Valores de prueba
    this.isAutenticated=true;
    let user={
      name:'Abiel',
      email: 'abiel2001d@gmail.com'
    }
    this.currentUser=user;
  } 

  cerrarSesion(): void {
    
    if (this.isAutenticated) {
      this.isAutenticated=false;
      this.router.navigate(['/']);
    }else{  
      this.isAutenticated=true;
    }
   
  } 
  
}
