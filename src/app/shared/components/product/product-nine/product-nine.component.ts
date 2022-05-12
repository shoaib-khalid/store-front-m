import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from 'src/app/shared/classes/product';

import { ModalService } from 'src/app/shared/services/modal.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { CompareService } from 'src/app/shared/services/compare.service';

import { environment } from 'src/environments/environment';
import { StoreService } from 'src/app/core/store/store.service';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/shared/classes/category';

@Component({
	selector: 'molla-product-nine',
	templateUrl: './product-nine.component.html',
	styleUrls: ['./product-nine.component.scss']
})

export class ProductNineComponent implements OnInit {

	@Input() product: any;

	maxPrice = 0;
	minPrice = 99999;
	currency: any
	isLoading: boolean
	category: Category

	SERVER_URL = environment.SERVER_URL;

	constructor(
		private storeService: StoreService,
		private router: Router,
		private modalService: ModalService,
		private cartService: CartService,
		private wishlistService: WishlistService,
		private compareService: CompareService,
		private toastrService: ToastrService
	) { }

	ngOnInit(): void {
		this.currency = this.storeService.getCurrency()
		// let min = this.minPrice;
		// let max = this.maxPrice;

		// this.product.variants.map(item => {
		// 	if (min > item.price) min = item.price;
		// 	if (max < item.price) max = item.price;
		// }, []);

		// if (this.product.variants.length == 0) {
		// 	min = this.product.sale_price
		// 		? this.product.sale_price
		// 		: this.product.price;
		// 	max = this.product.price;
		// }

		// this.minPrice = min;
		// this.maxPrice = max;
	}

	async onClick() {
        this.category = await this.storeService.getCategoryById(this.product.categoryId)

        this.router.navigate(['/' + this.category.name.split(' ').join('-') + '/' + this.product.seoName])
    }

	async addToCart(event: Event) {
		this.isLoading = true
		const addToCartResponse: any = await this.cartService.addToCart(this.product, 1)
		this.isLoading = false
		if (addToCartResponse.status === 201) {
			this.toastrService.success('Product added to Cart.');
		} else {
			this.toastrService.error('Sorry, you can\'t add that amount to the cart.');
		}
	}

	addToWishlist(event: Event) {
		event.preventDefault();

		if (this.isInWishlist()) {
			this.router.navigate(['/shop/wishlist']);
		} else {
			this.wishlistService.addToWishList(this.product);
		}
	}

	addToCompare(event: Event) {
		event.preventDefault();
		if (this.isInCompare()) return;
		this.compareService.addToCompare(this.product);
	}

	quickView(event: Event) {
		event.preventDefault();
		this.modalService.showQuickView(this.product);
	}

	isInCompare() {
		return this.compareService.isInCompare(this.product);
	}

	isInWishlist() {
		return this.wishlistService.isInWishlist(this.product);
	}
}