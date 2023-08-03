import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isAutenticated: boolean;
  currentUser: any;
  roleSelected:any
  constructor(private router: Router,private authService: AuthenticationService){
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
  
}
