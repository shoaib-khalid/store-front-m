import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CartService } from 'src/app/shared/services/cart.service';

import { environment } from 'src/environments/environment';
import { StoreService } from 'src/app/core/store/store.service';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/shared/classes/category';
import { Router } from '@angular/router';

@Component({
	selector: 'shop-cart-page',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit {

	cartItems = [];
	SERVER_URL = environment.SERVER_URL;
	shippingCost = 0;
	currency: string
	category: Category

	private subscr: Subscription;

	constructor(
		private store: Store<any>,
		public cartService: CartService,
		private storeService: StoreService,
		private toastrService: ToastrService,
		private router: Router
	) {
	}

	ngOnInit() {
		this.currency = this.storeService.getCurrency()
		// this.subscr = this.cartService.cartStream.subscribe(items => {
		// 	this.cartItems = items;
		// });
	}

	// ngOnDestroy() {
	// 	this.subscr.unsubscribe();
	// }

	async onClick(product) {
		this.category = await this.storeService.getCategoryById(product.productInventory.product.categoryId)

		let seoUrl = product.productInventory.product.seoUrl.split('/')
		let seoName = seoUrl[seoUrl.length - 1]
		if (seoName[seoName.length - 1] == "}") {
			seoName = seoName.slice(0, seoName.length - 1)
		}

		console.log("SeoName", seoName)
		this.router.navigate(['/' + this.category.name.split(' ').join('-') + '/' + seoName])
	}

	trackByFn(index: number, item: any) {
		if (!item) return null;
		return item.slug;
	}

	updateCart(event: any) {
		event.preventDefault();
		event.target.parentElement.querySelector('.icon-refresh').classList.add('load-more-rotating');

		setTimeout(() => {
			this.cartService.cart.forEach(item => {
				this.cartService.putCartItem(item)
			})
			event.target.parentElement.querySelector('.icon-refresh').classList.remove('load-more-rotating');
			document.querySelector('.btn-cart-update:not(.diabled)') && document.querySelector('.btn-cart-update').classList.add('disabled');
		}, 400);
	}

	changeShipping(value: number) {
		this.shippingCost = value;
	}

	onChangeQty(event: number, product: any) {
		product.quantity = event
		document.querySelector('.btn-cart-update.disabled') && document.querySelector('.btn-cart-update.disabled').classList.remove('disabled');

		this.cartService.cart = this.cartService.cart.reduce((acc, cur) => {
			if (cur.productName === product.name) {
				acc.push({
					...cur,
					qty: event
				});
			}
			else acc.push(cur);

			return acc;
		}, [])
	}

	removeFromCart(event: Event, product: any, index: number) {
		this.cartService.deleteCartItem(product, index);
	}
}