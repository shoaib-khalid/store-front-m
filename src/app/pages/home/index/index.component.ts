import { Component, OnInit } from '@angular/core';

import { ModalService } from 'src/app/shared/services/modal.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

import { introSlider, brandSlider, serviceSlider, bannerSlider } from '../data';
import { StoreService } from 'src/app/core/store/store.service';
import { Store } from 'src/app/shared/classes/store';
import { Category } from 'src/app/shared/classes/category';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
	selector: 'molla-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit {

	storeInfo: Store
	categories: Category[]
	products: any = [];
	posts = [];
	topProducts = [];
	featuredProducts = [];
	loaded = false;
	introSlider = introSlider;
	brandSlider = brandSlider;
	serviceSlider = serviceSlider;
	bannerSlider = bannerSlider;
	products1: any = []

	storeBannerUrls = []

	constructor(
		public apiService: ApiService,
		public utilsService: UtilsService,
		private modalService: ModalService,
		private storeService: StoreService,
		private cartService: CartService) {
		// this.modalService.openNewsletter();

		// this.storeService.getCategories().then((value) => {
		// 	console.log('categories', value)
		// 	this.categories = value
		// })

		// this.storeService.getStoreProducts().then((value) => {
		// 	console.log('products', value)
		// 	this.products = value
		// })

		// this.storeService.getStoreInfoByDomainName().then((value) => {
		// 	this.storeInfo = value
		// })

		// this.apiService.fetchHomeData().subscribe(result => {
		// 	this.products = result.products;
		// 	this.posts = result.blogs;
		// 	this.topProducts = utilsService.attrFilter(result.products, 'top');
		// 	this.featuredProducts = utilsService.attrFilter(result.products, 'featured');
		// 	this.loaded = true;
		// })
	}

	async ngOnInit() {

		await this.storeService.parseStoreFromUrl()

		Promise.all([
			this.storeService.getStoreInfoByStoreId(),
			this.storeService.getCategories(),
			this.storeService.getStoreProducts(),
		])
			.then((values) => {
				this.storeInfo = values[0]
				this.categories = values[1]
				this.products = values[2]
				this.populateAssets();
				this.loaded = true
			})
	}
	populateAssets() {
		let banners = []
		for (let storeAsset of this.storeInfo.storeAssets) {
			if (storeAsset.assetType == "BannerDesktopUrl") {
				banners.push(storeAsset.assetUrl);
			}
		}
		this.storeBannerUrls = banners
	}
}
