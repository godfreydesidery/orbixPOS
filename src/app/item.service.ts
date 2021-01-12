import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AppComponent } from'./app.component'
import { Observable } from 'rxjs';

import { HttpClient, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { delay, retry } from 'rxjs/operators';
import { Data } from './data';
//import { HttpErrorService } from './http-error.service';
import { error } from 'protractor';
//import { ErrorService } from './error.service';



@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor( private httpClient: HttpClient ) { }

  async getItem (id : any) {
    /**
     * gets item details with a specified id from datastore
     */
    var item = {}
    await this.httpClient.get(Data.baseUrl+"/items/"+id)
    .toPromise()
    .then(
      data=>{
        item=data
      }
    )
    .catch(
      error=>{
        console.log(error)
        alert(error['error'])
      }
    )
    return item
  }

  public async getItemId (barcode :string , itemCode :string , description : string){
    /**
     * gets item id given barcode, itemcode or description
     * on preference basis
     */
    var id = '' 
    if(barcode != '' && barcode != null){
      
      await this.httpClient.get(Data.baseUrl+"/items/primary_barcode="+barcode)
      .toPromise()
      .then(
        data=>{
          id=data['id']
        }
      )
      .catch(
        error=>{
          alert(error['error'])
        }
      )
    }else if (itemCode!='' && itemCode!=null){
      await this.httpClient.get(Data.baseUrl+"/items/item_code="+itemCode)
      .toPromise()
      .then(
        data=>{
          id=data['id']
        }
      )
      .catch(
        error=>{
          alert(error['error'])
        }
      )
    }else{
      await this.httpClient.get(Data.baseUrl+"/items/long_description="+description)
      .toPromise()
      .then(
        data=>{
          id=data['id']
        }
      )
      .catch(
        error=>{
          alert(error['message'])
          alert(error['error'])

        }
      )
    }
    return id
  } 

  public async  getItemsLongDescriptions (){
    /**
     * list items by long description attribute
     */
    var values: any= new Array()
    var items: any=['']
    await this.httpClient.get(Data.baseUrl+"/items/long_descriptions")
    .toPromise()
    .then(
      data=>{
        values = data
      }
    )
    .catch(
      error=>{}
    )
    Object.values(values).map((data)=>{
      items.push(data)
    })
    return items
  } 
  
  public getCostPrice(id : any){
    var price = 0
    //logic
    return price
  }

  public getRetailPrice(id : any){
    var price = 0
    //logic
    return price
  }

}
