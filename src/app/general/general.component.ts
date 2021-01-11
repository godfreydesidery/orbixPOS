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

  itemId : any
  barcode : string
  itemCode : string
  description : string
  price : number
  vat : number
  discount : number
  qty : number
  amount : number
  void : boolean


 public descriptions : any = []


  /**
   * Till information
   */
  tillId : any = null

  /**
   * Cart information
   */
  public cartId : any = 1

  public cartDetails : any ={}

  public cartDetailsSyncronizer : any = {}

  /**
   * Sale information
   */
  saleId : any

  /**
   * Payment information
   */
  paymentId : any



  constructor(private cartService : CartService, private httpClient : HttpClient) { }

  async ngOnInit(): Promise<void> {
    this.loadItemDescriptions()

    this.cartDetails = [
      { cartId : this.cartId,
        id : 1,
        barcode : '64536748575',
        itemCode : '64534',
        description : 'KILIMANJARO PURE DRINKING WATER 1500 ML PET',
        price : 1500,
        vat : 18,
        discount : 0.00,
        qty : 2,
        amount : 3000,
        void : false
      },
      { cartId : this.cartId,
        id : 1,
        barcode : '64536748575',
        itemCode : '64534',
        description : 'KILIMANJARO PURE DRINKING WATER 1500 ML PET',
        price : 1500,
        vat : 18,
        discount : 0.00,
        qty : 2,
        amount : 3000,
        void : false
      },
      { cartId : this.cartId,
        id : 1,
        barcode : '64536748575',
        itemCode : '64534',
        description : 'KILIMANJARO PURE DRINKING WATER 1500 ML PET',
        price : 1500,
        vat : 18,
        discount : 0.00,
        qty : 2,
        amount : 3000,
        void : false
      },
      { cartId : this.cartId,
        id : 1,
        barcode : '64536748575',
        itemCode : '64534',
        description : 'KILIMANJARO PURE DRINKING WATER 1500 ML PET',
        price : 1500,
        vat : 18,
        discount : 0.00,
        qty : 2,
        amount : 3000,
        void : false
      },
      { cartId : this.cartId,
        id : 1,
        barcode : '64536748575',
        itemCode : '64534',
        description : 'KILIMANJARO PURE DRINKING WATER 1500 ML PET',
        price : 1500,
        vat : 18,
        discount : 0.00,
        qty : 2,
        amount : 3000,
        void : false
      },
      { cartId : this.cartId,
        id : 1,
        barcode : '64536748575',
        itemCode : '64534',
        description : 'KILIMANJARO PURE DRINKING WATER 1500 ML PET',
        price : 1500,
        vat : 18,
        discount : 0.00,
        qty : 2,
        amount : 3000,
        void : false
      },
      { cartId : this.cartId,
        id : 1,
        barcode : '64536748575',
        itemCode : '64534',
        description : 'KILIMANJARO PURE DRINKING WATER 1500 ML PET',
        price : 1500,
        vat : 18,
        discount : 0.00,
        qty : 2,
        amount : 3000,
        void : false
      },
      { cartId : this.cartId,
        id : 1,
        barcode : '64536748575',
        itemCode : '64534',
        description : 'KILIMANJARO PURE DRINKING WATER 1500 ML PET',
        price : 1500,
        vat : 18,
        discount : 0.00,
        qty : 2,
        amount : 3000,
        void : false
      },
      { cartId : this.cartId,
        id : 1,
        barcode : '64536748575',
        itemCode : '64534',
        description : 'KILIMANJARO PURE DRINKING WATER 1500 ML PET',
        price : 1500,
        vat : 18,
        discount : 0.00,
        qty : 2,
        amount : 3000,
        void : false
      },
      { cartId : this.cartId,
        id : 1,
        barcode : '64536748575',
        itemCode : '64534',
        description : 'KILIMANJARO PURE DRINKING WATER 1500 ML PET',
        price : 1500,
        vat : 18,
        discount : 0.00,
        qty : 2,
        amount : 3000,
        void : false
      },
      { cartId : this.cartId,
        id : 1,
        barcode : '64536748575',
        itemCode : '64534',
        description : 'KILIMANJARO PURE DRINKING WATER 1500 ML PET',
        price : 1500,
        vat : 18,
        discount : 0.00,
        qty : 2,
        amount : 3000,
        void : false
      }
      
    ]
     

    /**
     * Destroys any existing local cart
     * check for an existing unheld cart in the database
     * Loads the cart if it exists, checks it and destroy it if it is empty,
     * Create a new cart if old cart has been deleted
     */







     
    
  }
  clear(){
    this.barcode ='' 
    this.itemCode  =''
    this.description ='' 
    this.price = null
    this.vat =null
    this.discount =null
    this.qty =null
    this.amount =null
  }
  searchByBarcode(){
    this.itemCode =''
    this.description = ''
    this.price=null
    this.vat=null
    this.discount=null
    this.qty=null
    this.searchItem(this.barcode,this.itemCode,this.description)
    
  }
  searchByItemCode(){
    this.barcode =''
    this.description = ''
    this.price=null
    this.vat=null
    this.discount=null
    this.qty=null
    this.searchItem(this.barcode,this.itemCode,this.description)
  }
  searchByDescription(){
    this.barcode =''
    this.itemCode =''
    this.price=null
    this.vat=null
    this.discount=null
    this.qty=null

    this.searchItem(this.barcode,this.itemCode,this.description)
  }

  async searchItem(barcode : string, itemCode : string, description : string){
    var found = false
		/**Search and display an item */
		var itemId = await (new ItemService(this.httpClient).getItemId(barcode , itemCode, description))
		if(itemId != '' && itemId !=null){
      var item = await (new ItemService(this.httpClient).getItem(itemId))
      this.itemId = itemId
      found = true
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
      this.postDetail('', this.itemId, this.itemCode, this.description, this.price, this.vat, this.discount, this.qty)
    }
  }
  async postDetail(detailId : any, itemId : any, itemCode : string, description : string, price : number, vat : number, discount : number, qty : number){
   var detail = {
     cartId : this.cartId,
     itemId : itemId,
     itemCode : itemCode,
     description : description,
     price : price,
     vat : vat,
     discount : discount,
     qty : qty
   } 
   await this.httpClient.post(Data.baseUrl+"/cart_details", detail)
   .toPromise()
   .then(
     data => {
       var id = data['id']
       this.pushDetail(id, itemId,itemCode,description,price,vat,discount,qty )
     }
   )

  }
  
  pushDetail(detailId : any, itemId : any, itemCode : string, description : string, price : number, vat : number, discount : number, qty : number){
    
    var detail : Detail = new Detail()
    detail.detailId = detailId
    detail.barcode = this.barcode

    for(let cartDetail of this.cartDetails){
      //if(cartDetail.detail)
      

     
    }

  }
























  async loadItemDescriptions(){
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
class Detail{
  detailId : any
  barcode : any
  itemId : any
  description : any
  price : any
  vat : any
  discount : any
  qty : any
}
