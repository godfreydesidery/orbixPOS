import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Data } from '../data';
import { ItemService } from '../item.service';

declare var $: any;

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

 public descriptions : any = []

  /**
   * Till information
   */
  till : Till = null

  /**
   * Cart information
   */
  public cart : Cart = null

  public cartDetails : CartDetail [] = []

  public cartDetailsSyncronizer : CartDetail [] = []

  /**
   * Sale information
   */
  saleId : any

  /**
   * Payment information
   */
  paymentId : any






  /**
   * The current item
   */
  itemId      : any
  barcode     : string
  itemCode    : string
  description : string
  price       : number
  vat         : number
  discount    : number
  qty         : number
  amount      : number
  void        : boolean

  constructor(private cartService : CartService, private httpClient : HttpClient) { }

  async ngOnInit(): Promise<void> {
    this.loadItemDescriptions()

    /**
     * Destroys any existing local cart
     * check for an existing unheld cart in the database
     * Loads the cart if it exists, checks it and destroy it if it is empty,
     * Create a new cart if old cart has been deleted
     */

  }
  
  clear(){
    this.itemId = ''
    this.barcode ='' 
    this.itemCode  =''
    this.description ='' 
    this.price = null
    this.vat =null
    this.discount =null
    this.qty =null
    this.amount =null
    this.void = false
  }
  searchByBarcode(value : any){
    this.itemCode =''
    this.description = ''
    this.price=null
    this.vat=null
    this.discount=null
    this.qty=null
    this.searchItem(value, '', '')
  }
  searchByItemCode(value : any){
    this.barcode =''
    this.description = ''
    this.price=null
    this.vat=null
    this.discount=null
    this.qty=null
    this.searchItem('', value, '')
  }
  searchByDescription(value : any){
    this.barcode =''
    this.itemCode =''
    this.price=null
    this.vat=null
    this.discount=null
    this.qty=null
    this.searchItem('', '', value)
  }

  async searchItem(barcode : string, itemCode : string, description : string){
    var found = false
		/**Search and display an item */
		var itemId = await (new ItemService(this.httpClient).getItemId(barcode , itemCode, description))
		if(itemId != '' && itemId !=null){
      var item = await (new ItemService(this.httpClient).getItem(itemId))
      this.itemId = itemId
      found = true
      if(barcode != ''){
        this.barcode = item['primaryBarcode']
      }
			this.itemCode = item['itemCode']
			this.description = item['longDescription']
      this.price = item['unitRetailPrice']
      this.vat = item['vat']
      this.discount = item['discount']
		}else{
      /** */
      found = false
      this.itemId = ''
    }
    if(found == true){
      this.postDetail('', this.itemId, this.barcode, this.itemCode, this.description, this.price, this.vat, this.discount, this.qty)
    }
  }
  async postDetail(detailId : any, itemId : any,barcode : any, itemCode : string, description : string, price : number, vat : number, discount : number, qty : number){
    var detail = new CartDetail()
    detail.cart.id = this.cart.id
    detail.itemId = itemId
    detail.itemCode = itemCode
    detail.description = description
    detail.price = price
    detail.vat = vat
    detail.discount = discount
    detail.qty = qty
   await this.httpClient.post(Data.baseUrl+"/cart_details", detail)
   .toPromise()
   .then(
     data => {
       var id = data['id']
       this.pushDetail(id, itemId, barcode, itemCode, description, price, vat, discount, qty)
     }
   )
   .catch(
     error => {
       this.rollBackCart()
     }
   )

  }
  pushDetail(detailId : any, itemId : any, barcode : any, itemCode : string, description : string, price : number, vat : number, discount : number, qty : number){
    /**
     * Puts the current item to cart
     * If similar item s present in the cart, with the same state, ie, not voided
     * increment, otherwise, adds the item to cart
     */
    var detail : CartDetail = new CartDetail()
    detail.id = detailId
    detail.itemId = itemId
    detail.barcode = barcode
    detail.itemCode = itemCode
    detail.description = description
    detail.price = price
    detail.vat = vat
    detail.qty = qty
    detail.void = false

    var present : boolean = false
    for(let cartDetail of this.cartDetails){
      if(cartDetail.id == detail.id){
        //increment qty
        cartDetail.qty = cartDetail.qty + detail.qty
        present = true
        break
      }
    }
    if(present == false){
      //push detail
      this.cartDetails.push(detail)
    }
    this.synchronizeCart()
  }
  
  synchronizeCart(){
  /**
   * Synchronizes cart with cart synchronizer
   */
    this.cartDetailsSyncronizer = this.cartDetails
  }
  
  rollBackCart(){
  /**
   * Revives a dirty cart to a previous clean state
   */ 
    this.cartDetails = this.cartDetailsSyncronizer
  }
  
  async loadItemDescriptions(){
  /**
   * Load items descriptions
   */
    var values = null
    await this.httpClient.get(Data.baseUrl+"/items/long_descriptions")
    .toPromise()
    .then(
      data=>{
        values = data
        console.log(values)
      }
    )
    .catch(
      error=>{}
    )
    Object.values(values).map((data)=>{
      this.descriptions.push(data)
    })
  }

}
/**
 * Till class
 */
class Till {
  id : any

}
/**
 * Cart class
 */
class Cart {
  id : any
  name : any
  status : any
  dateTime : any
  till : Till
}
/**
 * Cart detail class
 */
class CartDetail{
  id : any
  cart : Cart
  itemCode : any
  barcode : any
  itemId : any
  description : any
  price : any
  vat : any
  discount : any
  qty : any
  void : boolean
}
/**
 * Sale class
 */
class Sale {

}

  /**
 * Sale detail class
 */
class SaleDetail {

}
