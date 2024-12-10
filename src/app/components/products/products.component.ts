import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../products.service';
import { Product } from '../../Product';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AppDataState } from '../../state/product.state';
import { DataStateEnum } from '../../state/product.state';

import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products$: Observable<AppDataState<Product[]>> | null = null;
  readonly DataStateEnum = DataStateEnum;

  constructor(private productsService: ProductsService, private router: Router) {}

  ngOnInit(): void {
    this.onGetAllProducts();
  }

  onGetAllProducts(): void {
    this.products$ = this.productsService.getAllProducts().pipe(
      map(data => ({ dataState: DataStateEnum.LOADED, data: data })),
      startWith({ dataState: DataStateEnum.LOADING }),
      catchError(err => of({ dataState: DataStateEnum.ERROR, errorMessage: err.message }))
    );
  }

  onGetSelectedProducts(): void {
    this.products$ = this.productsService.getSelectedProducts().pipe(
      map(data => ({ dataState: DataStateEnum.LOADED, data: data })),
      startWith({ dataState: DataStateEnum.LOADING }),
      catchError(err => of({ dataState: DataStateEnum.ERROR, errorMessage: err.message }))
    );
  }

  onGetAvailableProducts(): void {
    this.products$ = this.productsService.getAvailableProducts().pipe(
      map(data => ({ dataState: DataStateEnum.LOADED, data: data })),
      startWith({ dataState: DataStateEnum.LOADING }),
      catchError(err => of({ dataState: DataStateEnum.ERROR, errorMessage: err.message }))
    );
  }

  onSearch(dataForm: any): void {
    const keyword = dataForm.keyword?.trim().toLowerCase();
    if (!keyword) {
      alert("Veuillez entrer un mot-clé pour la recherche.");
      return;
    }
    this.products$ = this.productsService.searchProducts(keyword).pipe(
      map(data => ({
        dataState: DataStateEnum.LOADED,
        data: data.filter(product => product.name.toLowerCase().includes(keyword))
      })),
      startWith({ dataState: DataStateEnum.LOADING }),
      catchError(err => of({ dataState: DataStateEnum.ERROR, errorMessage: err.message }))
    );
  }

  onSelect(p: Product): void {
    this.productsService.select(p).subscribe(data => {
      p.selected = data.selected;
    });
  }

  onDelete(p: Product): void {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      this.productsService.deleteProduct(p).subscribe(() => {
        this.onGetAllProducts();
      });
    }
  }

  onNewProduct(): void {
    this.router.navigateByUrl("/newProduct");
  }

  onEdit(p: Product): void {
    this.router.navigateByUrl(`/editProduct/${p.id}`);
  }
}
