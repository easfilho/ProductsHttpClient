import { Product } from 'src/app/model/product.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-product',
  templateUrl: './dialog-edit-product.component.html',
  styleUrls: ['./dialog-edit-product.component.css'],
})
export class DialogEditProductComponent implements OnInit {
  product: Product;

  constructor(
    public dialogRef: MatDialogRef<DialogEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public p: Product
  ) {
    this.product = p;
  }

  ngOnInit(): void {}

  cancel() {
    this.dialogRef.close();
  }
}
