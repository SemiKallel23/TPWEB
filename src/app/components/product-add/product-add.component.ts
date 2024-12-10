import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../products.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
  productFormGroup!: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productFormGroup = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      selected: [true],
      available: [true]
    });
  }

  onSaveProduct(): void {
    this.submitted = true;

    // Stop the execution if the form is invalid
    if (this.productFormGroup.invalid) return;

    // Save the product using the ProductsService
    this.productsService.save(this.productFormGroup.value).subscribe({
      next: (data) => {
        alert('Success saving product!');
        this.productFormGroup.reset();
        this.submitted = false;
      },
      error: (error) => {
        console.error('Error saving product', error);
        alert('Failed to save product. Please try again.');
      }
    });
  }
}
