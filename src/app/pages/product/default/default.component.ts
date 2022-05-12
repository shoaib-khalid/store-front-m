import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/core/store/store.service';
import { Category } from 'src/app/shared/classes/category';

import { Product } from 'src/app/shared/classes/product';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
	selector: 'product-default-page',
	templateUrl: './default.component.html',
	styleUrls: ['./default.component.scss']
})

export class DefaultPageComponent implements OnInit {

	product: any;
	prev: any;
	next: any;
	related = [];
	loaded = false;
	category: Category
	params: any

	constructor(
		public apiService: ApiService,
		private storeService: StoreService,
		private activeRoute: ActivatedRoute,
		public router: Router
	) {
		

			// this.storeService.getProductDetailsByName(params['seoName']).subscribe(result => {
			// 	if (result === null) {
			// 		this.router.navigate([''])
			// 	}
			// })
			// this.apiService.getSingleProduct(params['seoName']).subscribe(result => {
			// 	if (result === null) {
			// 		this.router.navigate(['/pages/404']);
			// 	}

			// 	this.product = result.product;
			// 	// this.prev = result.prevProduct;
			// 	// this.next = result.nextProduct;
			// 	this.related = result.relatedProducts;
			// 	this.loaded = true;
			// });
		// });
	}

	async ngOnInit() {
		this.activeRoute.params.subscribe(params => {
			this.loaded = false;
			this.params = params
		})
		await this.storeService.getCategoryByName(this.params['category'].split('-').join(' ')).then(
			value => {
				this.category = value
			},
			err => {
				console.log(err)
			}
		)
		
		// this.category = this.router.getCurrentNavigation().extras.state['category']

		await this.storeService.getProductDetailsByName(this.params['seoName']).then(
			value => {
				this.product = value;
				this.loaded = true
			},
			err => {
				console.log(err)
			}
		)
	}
}