import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  sortBy = 'title';
  currentImageIndex: { [key: number]: number } = {};

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        this.products = response.products;
        this.filteredProducts = this.products;
        this.loading = false;
        this.initializeImageIndex();
      },
      error: () => this.loading = false
    });
  }

  initializeImageIndex(): void {
    this.products.forEach(product => {
      this.currentImageIndex[product.id] = 0;
    });
  }

  onSortChange(event: any): void {
    const sortValue = event.target.value;
    this.sortBy = sortValue;

    switch (sortValue) {
      case 'priceAsc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'ratingAsc':
        this.filteredProducts.sort((a, b) => a.rating - b.rating);
        break;
      case 'ratingDesc':
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        this.filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  nextImage(productId: number): void {
    const product = this.products.find(p => p.id === productId);
    if (product && product.images.length > 0) {
      this.currentImageIndex[productId] = (this.currentImageIndex[productId] + 1) % product.images.length;
    }
  }

  prevImage(productId: number): void {
    const product = this.products.find(p => p.id === productId);
    if (product && product.images.length > 0) {
      this.currentImageIndex[productId] = (this.currentImageIndex[productId] - 1 + product.images.length) % product.images.length;
    }
  }

  viewDetail(product: Product): void {
    this.router.navigate(['/detail', product.id]);
  }

  addToCart(product: Product): void {
    this.productService.addToCart(product, 1);
    alert('¡Producto agregado al carrito!');
  }
}
