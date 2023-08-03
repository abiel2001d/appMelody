import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './share/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'appAngular';
  isAutenticated: boolean;

  constructor(
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe((valor) => (this.isAutenticated = valor));
  }
}
