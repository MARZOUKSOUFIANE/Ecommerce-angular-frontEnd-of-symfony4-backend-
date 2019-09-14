import { Component, OnInit } from '@angular/core';
import {CatalogueService} from '../service/catalogue.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {AuthenticationService} from '../services/authentication.service';
import {Product} from '../model/product.model';
import {CaddyService} from '../services/caddy.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  public products;
  public hostImages;
  public editPhoto: boolean;
  public currentProduct: any;
  public selectedFiles: any;
  public progress: number;
  public currentUploadedFile: any;
  public title: string;
  public timestamp: number=0;

  constructor(private catalogueService:CatalogueService,private sanitizer: DomSanitizer,private route:ActivatedRoute,
              private router:Router,public authService:AuthenticationService,
              private caddyService:CaddyService) {}


  ngOnInit() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        let url = val.url;
        let p1=this.route.snapshot.params.p1;

        if(p1==1){
          this.getProducts("/products?selected=true");
          this.title="les produits selectionnes";
        }
        else if(p1==2){
          let idCat=this.route.snapshot.params.p2;
          this.getProducts("/categories/"+idCat+"/products");
          this.title="les produits de la categorie "+idCat;
        }
        else if(p1==3){
          this.title="les produits selectionnes"
          //let idCat=this.route.snapshot.params.p2;
          this.getProducts("/products?promotion=true");
          this.title="les produits en promotion"
        }
        else if(p1==4){
          //let idCat=this.route.snapshot.params.p2;
          this.getProducts("/products?available=true");
          this.title="les produits disponibles"
        }
        else if(p1==5){
          //let idCat=this.route.snapshot.params.p2;
          this.getProducts("/products?available=true");
        }
      }
    });
    let p1=this.route.snapshot.params.p1;
    if(p1==1){
      this.getProducts("/products?selected=true");
      this.title="les produits selectionnes";
    }
  }

  private getProducts(url) {
    this.catalogueService.getRessource(url)
      .subscribe(data=>{
        this.products=data;
        this.timestamp=Date.now();
      },error=>{
        console.log(error)
      })
  }

  private getProductPhoto(id){
     this.hostImages=this.sanitizer.bypassSecurityTrustResourceUrl(this.catalogueService.host+"/photoProduct/"+id+'?ts='+this.getTs());
     return this.hostImages;
  }

  private getTs() {
    return this.timestamp;
  }

  onEditProduct(p) {
    this.progress=0;
    this.currentProduct=p;
    this.editPhoto=true;
  }

  onSelectedFile(event) {
    this.selectedFiles=event.target.files;
  }

  uploadPhoto() {
    this.progress=0;
    this.currentUploadedFile =this.selectedFiles.item(0);
    this.catalogueService.uploadPhotoProduct(this.currentUploadedFile,this.currentProduct.id).subscribe(event=>{
      if(event.type==HttpEventType.UploadProgress){
        this.progress=Math.round(100*event.loaded/event.total);
      }else if (event instanceof HttpResponse){
        //alert("Upload est termine avec succe");
        //this.getProducts("/products?selected=true");
        //window.location.reload();
        this.timestamp=Date.now();
      }
    },err=>{
      alert("problem de chargement... ");
    });
  }

  onProductDetails(p) {
    let url=btoa('http://127.0.0.1:8000'+p['@id']);
    this.router.navigate(['product-details/'+url]);
  }

  onAddProductToCaddy(p:Product) {
    if(this.authService.isAuthenticated)
      this.caddyService.addProductToCaddy(p);
    else
      this.router.navigate(['/login']);
  }


  isAdmin() {
    return this.authService.isAdmin()
  }

}
