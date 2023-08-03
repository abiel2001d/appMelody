import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent {
  loginForm: FormGroup;
  constructor(private router: Router, private fb: FormBuilder,) {
     this.formularioReactive()
   } 
  ngOnInit(): void { } 
  irInicio() { 
    // Redireccionar a la ruta raíz 
    this.router.navigate(['/']); 
  }

  formularioReactive() {
    this.loginForm = this.fb.group({
      email: [null,null],
      password: [null, null],
    });
  }

  

}
