import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService, CartItem } from '../../services/product.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  removeFromCart(productId: number): void {
    this.productService.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      this.productService.clearCart();
    }
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  checkout(): void {
    alert('Gracias por tu compra, vuelve pronto. :)');
  }
}
