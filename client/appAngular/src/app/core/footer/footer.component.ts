import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { CartService } from 'src/app/share/cart.service';
import { SerachProductoService } from 'src/app/share/search.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isAutenticated: boolean;
  currentUser: any;
  roleSelected: number;
  isMultiRol: boolean = false;
  qtyItems: number = 0;
  showSearchbar:boolean
  sortingOrder: 'asc' | 'desc' = 'desc';
  clienteButtonStyles: any = {
    'border-radius': '15px',
    'padding': '0px 20px 0px 20px',
    'font-weight': '100',
  };

  proveedorButtonStyles: any = {
    'border-radius': '15px',
    'padding': '0px 20px 0px 20px',
    'font-weight': '100',
  };

  constructor(
    private cartService: CartService,
    private authService: AuthenticationService,
    private serachService:SerachProductoService,
    private router: Router
  ) {
    this.qtyItems= this.cartService.quantityItems()
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    this.authService.isAuthenticated.subscribe((valor) => (this.isAutenticated = valor));
    this.authService.isMultiRol.subscribe((valor) => (this.isMultiRol = valor));
    this.authService.currentSelectedRole.subscribe((valor) => {
      this.roleSelected = valor;
      this.updateButtonStyles();
    });
    this.serachService.show$.subscribe((valor) => (this.showSearchbar = valor));
    this.cartService.countItems.subscribe((value) => {
      this.qtyItems = value;
    });
  }

  searchProducto(text:string){
    this.serachService.filterData(text)
  }

  toggleSortingOrder(){
    this.sortingOrder = this.sortingOrder === 'asc' ? 'desc' : 'asc';
    this.serachService.sortData(this.sortingOrder)
  }

  login() {
    this.router.navigate(['usuario/login']);
  }

  updateButtonStyles(): void {
    if (this.roleSelected === 3) {
      this.clienteButtonStyles['background-color'] = '#1a1a1ace';
      this.clienteButtonStyles['color'] = 'white';
      this.proveedorButtonStyles['background-color'] = 'white';
      this.proveedorButtonStyles['color'] = '#1a1a1ace';
    } else if (this.roleSelected === 2) {
      this.clienteButtonStyles['background-color'] = 'white';
      this.clienteButtonStyles['color'] = '#1a1a1ace';
      this.proveedorButtonStyles['background-color'] = '#1a1a1ace';
      this.proveedorButtonStyles['color'] = 'white';
    }
  }

  setActiveButton(activeButton: 3 | 2): void {
    this.authService.setSelectedRole(activeButton);
    this.updateButtonStyles();

    if (activeButton === 3) {
      this.router.navigate(['inicio']);
    } else if (activeButton === 2) {
      this.router.navigate(['/pedido/dashboard']);
    }
  }
}
