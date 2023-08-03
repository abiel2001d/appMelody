import { Component,OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit{
  isAutenticated: boolean;
  constructor(
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe((valor) => (this.isAutenticated = valor));
  }
}
