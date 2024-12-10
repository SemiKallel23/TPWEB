import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../products.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productId: number; // Identifiant du produit à éditer
  productFormGroup!: FormGroup;
  submitted: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Récupérer l'ID du produit depuis les paramètres de route
    this.productId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    // Charger les détails du produit à partir de l'API
    this.productsService.getProduct(this.productId).subscribe(
      (product) => {
        console.log("Loaded product:", product);

        // Initialiser le formulaire avec les données du produit
        this.productFormGroup = this.fb.group({
          id: [product.id],
          name: [product.name, Validators.required],
          price: [product.price, Validators.required],
          quantity: [product.quantity, Validators.required],
          selected: [product.selected],
          available: [product.available]
        });
      },
      (error) => {
        console.error("Error loading product", error);
        alert("Failed to load product data. Please try again.");
      }
    );
  }

  onUpdateProduct(): void {
    this.submitted = true;

    // Validation du formulaire
    if (this.productFormGroup.invalid) {
      return;
    }

    console.log("Form Data:", this.productFormGroup.value);

    // Mise à jour du produit via l'API
    this.productsService.updateProduct(this.productFormGroup.value).subscribe(
      (data) => {
        alert("Success! Product updated.");
        this.router.navigate(['/products']); // Redirection après succès
      },
      (error) => {
        console.error("Error updating product", error);
        alert("Failed to update product. Please try again.");
      }
    );
  }
}
