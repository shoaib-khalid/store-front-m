import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StoreService } from 'src/app/core/store/store.service';
import { Category } from 'src/app/shared/classes/category';

import { CartService } from 'src/app/shared/services/cart.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'molla-cart-menu',
	templateUrl: './cart-menu.component.html',
	styleUrls: ['./cart-menu.component.scss']
})

export class CartMenuComponent implements OnInit {

	currency: string
	category: Category

	constructor(
		private toastrService: ToastrService,
		private storeService: StoreService,
		public cartService: CartService,
		private router: Router
	) {
	}

	ngOnInit(): void {
		this.currency = this.storeService.getCurrency()
	}

	async onClick(product) {
		this.category = await this.storeService.getCategoryById(product.productInventory.product.categoryId)

		let seoName = product.productInventory.product.seoName
		if (seoName[seoName.length - 1] == "}") {
			seoName = seoName.slice(0, seoName.length - 1)
		}

		this.router.navigate(['/' + this.category.name.split(' ').join('-') + '/' + seoName])
	}

	removeFromCart(event: Event, product: any, index: number) {
		this.cartService.deleteCartItem(product, index);
	}
}