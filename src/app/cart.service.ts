import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  createCart(){

  }
  syncronizeCart(){

  }
  loadItemToCart(){

  }
  editCartItem(){

  }
  voidCartItem(){

  }
  unvoidCartitem(){

  }
  holdCart(){

  }
  unholdCart(){

  }
  emptyCart(){

  }
  destroyCart(){
    
  }
  destroyLocalCart(cart : any){
    cart = null

    return cart
  }
  checkIfCartExist(till : any){
    var exist : boolean = false

    return exist
  }
  loadOldCart(till : any){
    var cart : any = null

    return cart
  }


}
export class Cart{
  id : any
  till : {}
}
export class CartDetail{
  id : any
  cart : {}
}
