import { Component, OnInit, ViewEncapsulation, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import imagesLoaded from 'imagesloaded';

import { Product } from 'src/app/shared/classes/product';
import { environment } from 'src/environments/environment';

import { ApiService } from 'src/app/shared/services/api.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { CompareService } from 'src/app/shared/services/compare.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { sliderOpt } from 'src/app/shared/data';
import { StoreService } from 'src/app/core/store/store.service';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/shared/classes/category';

declare var $: any;

@Component({
	selector: 'molla-quick-view',
	templateUrl: './quick-view.component.html',
	styleUrls: ['./quick-view.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class QuickViewComponent implements OnInit {
	

	// @Input() slug = '';
	@Input() product: any;
	isLoading: boolean;
	loaded = true;
	options = {
		...sliderOpt,
		dots: false,
		nav: false,
		loop: false,
		onTranslate: (e: any) => this.itemChange(e, this)
	}
	// variationGroup = [];
	// selectableGroup = [];
	// sizeArray = [];
	// colorArray = [];
	// selectedVariant = {
	// 	color: null,
	// 	colorName: null,
	// 	price: null,
	// 	size: "",
	// 	disabled: false
	// };
	// maxPrice = 0;
	// minPrice = 99999;
	paddingTop = '100%';
	currentIndex = 0;
	qty = 1;
	pictures = []
	category: Category

	SERVER_URL = environment.SERVER_URL;
	currency = ''

	@ViewChild('singleSlider') singleSlider: any;

	constructor(
		private toastrService: ToastrService,
		private storeService: StoreService,
		public apiService: ApiService,
		public cartService: CartService,
		public wishlistService: WishlistService,
		public compareService: CompareService,
		public utilsService: UtilsService,
		public router: Router,
		public el: ElementRef) {
	}

	public trackByFn(index, item) {
		if (!item) return null;
		return item.id;
	}

	ngOnInit(): void {
		this.isLoading = true;
		this.currency = this.storeService.getCurrency()
		this.product.productAssets.forEach(asset => {
			this.pictures.push(asset.url)
		});
	}

	itemChange(e: any, self: any) {
		document.querySelector('#product-image-gallery').querySelector('.product-gallery-item.active').classList.remove('active');
		document.querySelector('#product-image-gallery').querySelectorAll('.product-gallery-item')[e.item.index].classList.add('active');

		self.currentIndex = e.item.index;
	}

	async onClick() {
        this.category = await this.storeService.getCategoryById(this.product.categoryId)

        this.router.navigate(['/' + this.category.name.split(' ').join('-') + '/' + this.product.seoName])
    }

	async addToCart(event: Event) {
		this.isLoading = true
		const addToCartResponse: any = await this.cartService.addToCart(this.product, this.qty)
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

	isInCompare() {
		return this.compareService.isInCompare(this.product);
	}

	isInWishlist() {
		return this.wishlistService.isInWishlist(this.product);
	}

	refreshSelectableGroup() {
		// let tempArray = [...this.variationGroup];
		// if (this.selectedVariant.color) {
		// 	tempArray = this.variationGroup.reduce((acc, cur) => {
		// 		if (this.selectedVariant.color !== cur.color) {
		// 			return acc;
		// 		}
		// 		return [...acc, cur];
		// 	}, []);
		// }

		// this.sizeArray = tempArray.reduce((acc, cur) => {
		// 	if (acc.findIndex(item => item.size == cur.size) !== -1)
		// 		return acc;
		// 	return [...acc, cur];
		// }, []);

		// tempArray = [...this.variationGroup];
		// if (this.selectedVariant.size) {
		// 	tempArray = this.variationGroup.reduce((acc, cur) => {
		// 		if (this.selectedVariant.size !== cur.size) {
		// 			return acc;
		// 		}
		// 		return [...acc, cur];
		// 	}, []);
		// }

		// this.colorArray = this.product.variants.reduce((acc, cur) => {
		// 	if (
		// 		tempArray.findIndex(item => item.color == cur.color) == -1
		// 	) {
		// 		return [
		// 			...acc,
		// 			{
		// 				color: cur.color,
		// 				colorName: cur.color_name,
		// 				price: cur.price,
		// 				disabled: true
		// 			}
		// 		];
		// 	}
		// 	return [
		// 		...acc,
		// 		{
		// 			color: cur.color,
		// 			colorName: cur.color_name,
		// 			price: cur.price,
		// 			disabled: false
		// 		}
		// 	];
		// }, []);

		// let toggle = this.el.nativeElement.querySelector('.variation-price');
		// if (toggle) {
		// 	if (this.selectedVariant.color && this.selectedVariant.size !== "") {
		// 		$(toggle).slideDown();
		// 	} else {
		// 		$(toggle).slideUp();
		// 	}
		// }
	}

	selectColor(event: Event, item: any) {
		event.preventDefault();

		// if (item.color == this.selectedVariant.color) {
		// 	this.selectedVariant = {
		// 		...this.selectedVariant,
		// 		color: null,
		// 		colorName: null,
		// 		price: item.price
		// 	};
		// } else {
		// 	this.selectedVariant = {
		// 		...this.selectedVariant,
		// 		color: item.color,
		// 		colorName: item.colorName,
		// 		price: item.price
		// 	};
		// }

		// this.refreshSelectableGroup();
	}

	selectSize(event: Event) {
		// if (this.selectedVariant.size == 'null') {
		// 	this.selectedVariant = { ...this.selectedVariant, size: "" };
		// }
		// if ($(event.target).val() == "") {
		// 	this.selectedVariant = { ...this.selectedVariant, size: "" };
		// } else {
		// 	this.selectedVariant = { ...this.selectedVariant, size: $(event.target).val() };
		// }

		this.refreshSelectableGroup();
	}

	onChangeQty(current: number) {
		this.qty = current;
	}

	clearSelection() {
		// this.selectedVariant = {
		// 	...this.selectedVariant,
		// 	color: null,
		// 	colorName: null,
		// 	size: ""
		// };
		this.refreshSelectableGroup();
	}

	closeQuickView() {
		let modal = document.querySelector('.quickView-modal') as HTMLElement;
		if (modal)
			modal.click();
	}

	changeImage($event: Event, i = 0) {
		this.currentIndex = i;
		this.singleSlider.to(i);
		$event.preventDefault();
	}
}