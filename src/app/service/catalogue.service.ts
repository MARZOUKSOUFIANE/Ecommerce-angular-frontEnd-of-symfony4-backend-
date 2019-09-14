import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  public host:string=" http://127.0.0.1:8000/api"

  constructor(private http:HttpClient) { }


  public getRessource(url){
    return this.http.get(this.host+url);
  }

  uploadPhotoProduct(file: File,idProduct) : Observable<HttpEvent<{}>>{
      let formData:FormData=new FormData();
    formData.append('file',file);
    const  req=new HttpRequest('POST',this.host+'/uploadPhoto/'+idProduct,formData,{
      reportProgress:true,
      responseType:'text'
    });
    return this.http.request(req);
  }

  getProduct(url) :Observable<Product>{
    return this.http.get<Product>(url);
  }

  patchResource(url, data) {
    return this.http.put(url,data);
  }
}
