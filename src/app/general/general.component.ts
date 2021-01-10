import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  cart : any = null
  cartSyncronizer : any = null
  till : any = null

  constructor(private cartService : CartService) { }

  ngOnInit(): void {
    /**
     * Destroys any existing local cart
     * check for an existing unheld cart in the database
     * Loads the cart if it exists, checks it and destroy it if it is empty,
     * Create a new cart if old cart has been deleted
     */
    this.cart = this.cartService.destroyLocalCart(this.cart)
    this.synchronize()
    if(this.cartService.checkIfCartExist(this.till)){
      this.cart = this.cartService.loadOldCart(this.till)
    }else{
      this.cart = this.cartService.createCart()
    }
    this.synchronize()
  }
  synchronize(){
    this.cartSyncronizer = this.cart
  }
  rollBack(){
    this.cart = this.cartSyncronizer
  }
  refresh(cart : any){

  }

}
