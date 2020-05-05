import { DialogEditProductComponent } from './dialog-edit-product/dialog-edit-product.component';
import { Component } from '@angular/core';
import { ProductService } from './services/product/product.service';
import { Product } from './model/product.model';
import { Observable } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  productsErrorHandling: Product[];
  productsLoading: Product[];
  isLoadingProducts = false;
  simpleRequestProduct$: Observable<Product[]>;
  productsIds: Product[];
  newlyProducts: Product[] = [];
  productsToDelete: Product[];
  productsToUpdate: Product[];

  constructor(
    private productSevice: ProductService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  getSimpleHttpRequest() {
    this.simpleRequestProduct$ = this.productSevice.getProducts();
  }

  getProductsErrorHandling() {
    this.productSevice.getProductsError().subscribe(
      (products) => {
        const config = new MatSnackBarConfig();
        config.duration = 2000;
        config.panelClass = ['snack-ok'];
        this.productsErrorHandling = products;
        this.snackBar.open('Products successfuly loaded!', '', config);
      },
      (error) => this.showError(error)
    );
  }

  getProductsLoading() {
    this.isLoadingProducts = true;
    this.productSevice.getProductsLoading().subscribe(
      (products) => {
        this.productsLoading = products;
        this.isLoadingProducts = false;
      },
      (error) => this.showError(error)
    );
  }

  loadName(id: number) {
    const product: Product = this.productsIds[id];
    this.productSevice
      .getProductName(product.id)
      .subscribe((productName) => (product.name = productName));
  }

  getProductsIds() {
    this.productSevice.getProductsIds().subscribe(
      (ids) =>
        (this.productsIds = ids.map((productId) => ({
          id: productId,
          name: '',
          department: '',
          price: 0,
        })))
    );
  }

  saveProduct(name: string, department: string, price: number) {
    const product: Product = { name, department, price };
    this.productSevice.saveProduct(product).subscribe(
      (productSaved) => {
        this.newlyProducts.push(productSaved);
      },
      (error) => this.showError(error)
    );
  }

  deleteProduct(product: Product) {
    this.productSevice.delete(product).subscribe(
      () => {
        this.loadProductsToDelete();
      },
      (error) => this.showError(error)
    );
  }

  loadProductsToDelete() {
    this.productSevice
      .getProducts()
      .subscribe((products) => (this.productsToDelete = products));
  }

  loadProductsToUpdate() {
    this.productSevice
      .getProducts()
      .subscribe((products) => (this.productsToUpdate = products));
  }

  editProduct(product: Product) {
    const productToUpdate = { ...product };
    const dialogRef = this.dialog.open(DialogEditProductComponent, {
      width: '400px',
      data: productToUpdate,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((responseDialog: Product) => responseDialog !== undefined),
        switchMap((responseDialog: Product) =>
          this.productSevice.update(responseDialog)
        )
      )
      .subscribe((responseDialog: Product) => {
        this.productSevice.update(responseDialog).subscribe(
          () => this.loadProductsToUpdate(),
          (error) => this.showError(error)
        );
      });
  }

  private showError(error: any) {
    this.productsErrorHandling = null;
    const config = new MatSnackBarConfig();
    config.duration = 2000;
    config.panelClass = ['snack-error'];
    if (error.status === 0) {
      this.snackBar.open('Could not connect to the server', '', config);
    } else {
      this.snackBar.open(error.error, '', config);
    }
  }
}
