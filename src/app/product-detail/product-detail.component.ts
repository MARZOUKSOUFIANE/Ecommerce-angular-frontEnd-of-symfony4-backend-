import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CatalogueService} from '../service/catalogue.service';
import {DomSanitizer} from '@angular/platform-browser';
import {AuthenticationService} from '../services/authentication.service';
import {HttpEventType, HttpResponse} from '../../../node_modules/@angular/common/http';
import {Product} from '../model/product.model';
//import {CaddyService} from '../services/caddy.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  public currentProduct:Product;
  public selectedFiles;
  public progress: number;
  public currentFileUpload: any;
  public currentTime: number;
  public editPhoto: boolean;
  public mode: number=0;
  public hostImages;
  public timestamp;

  constructor(private router:Router, private route:ActivatedRoute,
              public catalService:CatalogueService,
              public authService:AuthenticationService,
              private sanitizer: DomSanitizer
             /* public caddyService:CaddyService*/) { }

  ngOnInit() {
    let url=atob(this.route.snapshot.params.url);
    console.log(url);
    this.catalService.getProduct(url)
      .subscribe(data=>{
        this.currentProduct=data;
      },err=>{
        console.log(err);
      })
  }

  onEditPhoto(p) {
    this.currentProduct=p;
    this.editPhoto=true;
  }

  onSelectedFile(event) {
    this.selectedFiles=event.target.files;
  }

  uploadPhoto() {
    this.progress = 0;
    this.currentFileUpload = this.selectedFiles.item(0)
    this.catalService.uploadPhotoProduct(this.currentFileUpload, this.currentProduct.id).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        //console.log(this.router.url);
        //this.getProducts(this.currentRequest);
        //this.refreshUpdatedProduct();
        this.currentTime=Date.now();
        this.editPhoto=false;
      }
    },err=>{
      alert("Problème de chargement");
    })



    this.selectedFiles = undefined
  }

  onAddProductToCaddy(p:Product) {
    if(!this.authService.isAuthenticated){
      this.router.navigateByUrl("/login");
    }
    else{
     // this.caddyService.addProduct(p);
    }
  }

  getTS() {
    return this.currentTime;
  }

  onEditProduct() {
    this.mode=1;
  }

  onUpdateProduct(data) {
    let url='http://127.0.0.1:8000'+this.currentProduct['@id'];
    this.catalService.patchResource(url,data)
      .subscribe(d=>{
      //  this.currentProduct=d;
        this.mode=0;
      },err=>{
        console.log(err);
      })
  }

  getProductPhoto(id) {
    this.hostImages=this.sanitizer.bypassSecurityTrustResourceUrl(this.catalService.host+"/photoProduct/"+id+'?ts='+this.getTs());
    return this.hostImages;
  }

  private getTs() {
    this.timestamp=Date.now();
    return this.timestamp;
  }
}
