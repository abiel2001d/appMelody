import { Component,OnInit  } from '@angular/core';
import { CartService } from 'src/app/share/cart.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit{
  qtyItems:Number = 0;
  constructor(private cartService: CartService,){
    this.qtyItems=this.cartService.quantityItems()
  }
  ngOnInit(): void {
    this.cartService.countItems.subscribe((value)=>{
      this.qtyItems=value
     })
  }
}
