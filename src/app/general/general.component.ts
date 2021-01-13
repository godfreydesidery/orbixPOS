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

  addMany : boolean = true

 public descriptions : any = []

  /**
   * Till information
   */
  till : Till = new Till()

  tillName : string = 'SANILI TILL 1'

  /**
   * Cart information
   */
  public cart : Cart = new Cart()

  public item : Item = new Item()

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



  computerName : string = 'SANILI TILL 1'



  /**
   * The current item
   */
  cartDetail : CartDetail = new CartDetail()

  itemId : any = null
  barcode     : string
  itemCode    : string
  description : string
  price       : number
  vat         : number
  discount    : number
  quantity    : number
  amount      : number
  voided      : boolean

  constructor(private cartService : CartService, private httpClient : HttpClient) { }

  async ngOnInit(): Promise<void> {
    

    /**
     * Destroys any existing local cart
     * check for an existing unheld cart in the database
     * Loads the cart if it exists, checks it and destroy it if it is empty,
     * Create a new cart if old cart has been deleted
     */

     if(await this.isNetworkAvailable() == true){
       var till = await this.loadTill(this.tillName)
       if(till != null){
         this.till = till
         if(await this.isCartAvailable(till) == true){
           if(await this.isEmpty(till) == true){
             await this.destroyCart(till)
             await this.createCart(till)
           }
         }else{
           await this.createCart(till)
         }
         var cart = await this.loadCart(till)
         var cartDetails = await this.loadCartDetails(cart)
         this.cart = cart
         this.cartDetails = cartDetails
         console.log(cart)
       }else{
         alert('Could not load till information')
       }
     }else{
       this.till = null
       this.cart = null
       alert('Network error')
     }

     this.loadItemDescriptions()

  }
  async loadTill(tillName) : Promise<Till>{
    var till : Till = new Till()
    await this.httpClient.get(Data.baseUrl+"/tills/till_name="+tillName).toPromise()
    .then(
      data => {
        till.id       = data['id']
        till.tillNo   = data['tillNo']
        till.tillName = data['tillName']
        till.status   = data['status']
      }
    )
    .catch(
      error => {
        till = null
      }
    )
    return till
  }
  async isNetworkAvailable() : Promise<boolean>{
    var available : boolean = false
    await this.httpClient.get(Data.baseUrl+"/network_status").toPromise()
    .then(
      data => {
        if(data == '1'){
          available = true
        }else if(data == 0){
          available == false
          alert('Database error')
        }
      }
    )
    .catch(
      error => {
        alert('Network error1')
        available = false
      }
    )
    
    return available
  }
  async isCartAvailable(till : Till) : Promise<boolean>{
    var available = false
    await this.httpClient.get(Data.baseUrl+"/carts/till_no="+till.tillNo).toPromise()
    .then(
      data => {
        if(data['id'] != null && data['id'] != ''){
          available = true
        }else{
          available = false
        }
        console.log(data)
      }
    )
    .catch(
      error => {
        available = false
      }
    )
    return available
  }

  async isEmpty(till : Till) : Promise<any>{
    var empty : any = false
    await this.httpClient.get(Data.baseUrl+"/carts/is_empty/till_no="+till.tillNo).toPromise()
    .then(
      data => {
        empty = data
      }
    )
    .catch(
      error => {
        empty = false
      }
    )
    return empty
  }

  async destroyCart(till : Till) : Promise<void>{
    await this.httpClient.delete(Data.baseUrl+"/carts/destroy/till_no="+till.tillNo).toPromise()
    .then(
      data => {

      }
    )
    .catch(
      error => {
        console.log(error)
      }
    )
  }

   async createCart(till : Till) : Promise<boolean>{
     var created : any = false
     await this.httpClient.post(Data.baseUrl+"/carts/create", till).toPromise()
     .then(
       data => {
         created = data
       }
     )
     .catch(
       error => {
         console.log(error)
         created = false
       }
     )
     return created
   }
   async loadCart(till : Till) : Promise<Cart>{
     var cart : Cart = new  Cart()
     await this.httpClient.get(Data.baseUrl+"/carts/till_no="+till.tillNo).toPromise()
     .then(
       data => {
         cart.id        = data['id']
         cart.name      = data['name']
         cart.status    = data['status']
         cart.dateTime  = data['dateTime']
         cart.till      = data['till']
       }
     )
     .catch(
       error => {
         cart = null
       }
     )
     return cart
   }
   async loadCartDetails(cart : Cart) : Promise<CartDetail[]>{
    var cartDetails : CartDetail [] = []
    var details = null
    await this.httpClient.get(Data.baseUrl+"/cart_details/cart_id="+cart.id).toPromise()
    .then(
      data => {
        details = data
      }
    )
    .catch(
      error => {
        console.log(error)
        cartDetails = null
      }
    )
    if(details != null){
      for(let detail of details){
        var cartDetail : CartDetail = new CartDetail()
        cartDetail.id = detail['id']
        cartDetail.barcode = detail['barcode']
        cartDetail.itemCode = detail['itemCode']
        cartDetail.description = detail['description']
        cartDetail.price = detail['price']
        cartDetail.discount = detail['discount']
        cartDetail.quantity = detail['quantity']
        cartDetail.vat = detail['vat']
        cartDetail.voided = detail['voided']
        cartDetail.amount = cartDetail.quantity*cartDetail.price*((100 - cartDetail.discount)/100)
        cartDetails.push(cartDetail)
      }
    }
    return cartDetails
  }


  
  clear(){
    this.itemId = null
    this.barcode ='' 
    this.itemCode  =''
    this.description ='' 
    this.price = null
    this.vat =null
    this.discount =null
    this.quantity =null
    this.amount =null
    this.voided = false
  }
  searchByBarcode(value : any){
    this.cartDetail.itemCode =''
    this.cartDetail.description = ''
    this.cartDetail.price=null
    this.cartDetail.vat=null
    this.cartDetail.discount=null
    this.cartDetail.quantity=null
    this.searchItem(value, '', '')
  }
  searchByItemCode(value : any){
    this.cartDetail.barcode =''
    this.cartDetail.description = ''
    this.cartDetail.price=null
    this.cartDetail.vat=null
    this.cartDetail.discount=null
    this.cartDetail.quantity=null
    this.searchItem('', value, '')
  }
  searchByDescription(value : any){
    this.cartDetail.barcode =''
    this.cartDetail.itemCode =''
    this.cartDetail.price=null
    this.cartDetail.vat=null
    this.cartDetail.discount=null
    this.cartDetail.quantity=null
    this.searchItem('', '', value)
  }

  async searchItem(barcode : string, itemCode : string, description : string){
    if(this.till == null){
      alert('Operation failed. Till information not found')
      this.clear()
      return
    }
    var found = false
		/**Search and display an item */
		var itemId = await (new ItemService(this.httpClient).getItemId(barcode , itemCode, description))
		if(itemId != '' && itemId !=null){
      this.itemId = itemId
      var item = await (new ItemService(this.httpClient).getItem(itemId))
      found = true
      if(barcode != ''){
        this.cartDetail.barcode = item['primaryBarcode']
      }else{
        this.cartDetail.barcode = ''
      }
			this.cartDetail.itemCode = item['itemCode']
			this.cartDetail.description = item['longDescription']
      this.cartDetail.price = item['unitRetailPrice']
      this.cartDetail.vat = item['vat']
      this.cartDetail.discount = item['discount']


      //this.cartDetail.quantity = this.quantity

      this.barcode     = this.cartDetail.barcode
      this.itemCode    = this.cartDetail.itemCode
      this.description = this.cartDetail.description
      this.price       = this.cartDetail.price
      this.vat         = this.cartDetail.vat
      this.discount    = this.cartDetail.discount
      this.amount      = this.cartDetail.amount
      this.voided      = this.cartDetail.voided


		}else{
      /** */
      found = false
    }
    if(found == true){
      if(this.addMany == false){
        this.addToCart()
      }
    }
  }
  validateInputs(cartDetail : CartDetail) : boolean{
    var valid : boolean = true
    if(this.quantity <= 0 || isNaN(this.quantity) || this.quantity % 1 !=0){
      valid = false
      alert('Invalid inputs')
    }

    return valid
  }
  async addToCart(){
    if(this.validateInputs(this.cartDetail) == false){
      return;
    }
    if(this.itemId != null){
      await this.postDetail('', this.cart, this.cartDetail.barcode, this.cartDetail.itemCode, this.cartDetail.description, this.cartDetail.price, this.cartDetail.vat, this.cartDetail.discount, this.quantity)
    }
  }
  async postDetail(detailId : any, cart : Cart, barcode : any, itemCode : string, description : string, price : number, vat : number, discount : number, quantity : number) : Promise<CartDetail>{
    
    var detail = new CartDetail()
    detail.cart = cart
    detail.barcode =barcode
    detail.itemCode = itemCode
    detail.description = description
    detail.price = price
    detail.vat = vat
    detail.discount = discount
    detail.quantity = quantity

    

   await this.httpClient.post(Data.baseUrl+"/cart_details", detail)
   .toPromise()
   .then(
     data => {
       detail.id = data['id']
       detail.cart = data['cart']
       detail.barcode = data['barcode']
       detail.item = data['item']
       detail.itemCode = data['itemCode']
       detail.description = data['description']
       detail.price = data['price']
       detail.vat = data['vat']
       detail.discount = data['discount']
       detail.quantity = data['quantity']
       detail.amount = detail.quantity*detail.price*((100 - detail.discount)/100)
       console.log(detail)

       this.pushDetail(detail)
       


     }
   )
   .catch(
     error => {
       console.log(error)
       
       detail = null
       this.rollBackCart()
     }
   )
   console.log(detail)
   return detail
  }
  pushDetail(detail : CartDetail){
    /**
     * Puts the current item to cart
     * If similar item s present in the cart, with the same state, ie, not voided
     * increment, otherwise, adds the item to cart
     */
    detail.voided = false
    var present : boolean = false
    //detail.quantity = this.cartDetail.quantity
    for(let cartDetail of this.cartDetails){
      if(cartDetail.id == detail.id){
        cartDetail.quantity = detail.quantity
        cartDetail.amount = cartDetail.quantity*cartDetail.price*((100 - cartDetail.discount)/100)
        present = true
        break
      }
    }
    if(present == false){
      //push detail
      this.cartDetails.push(detail)
    }
    this.clear()
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
  id           : any
  tillNo       : string
  tillName     : string
  computerName : string
  status       : string

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
  item : Item
  description : any
  price : any
  vat : any
  discount : any
  quantity : number
  amount : any
  voided : boolean
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

class Item{
  id : any
}
