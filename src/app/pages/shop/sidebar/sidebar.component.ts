import { Component, OnInit, HostListener, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/core/store/store.service';

import { ApiService } from 'src/app/shared/services/api.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
	selector: 'shop-sidebar-page',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
})

export class SidebarPageComponent implements OnInit {
	products = [];
	perPage = 12;
	type = 'list';
	totalCount = 0;
	orderBy = 'default';
	pageTitle = 'List';
	toggle = false;
	searchTerm = '';
	loaded = false;
	firstLoad = false;
	pageNumber = 1
	category: any
	categoryName: any

	constructor(private storeService: StoreService, public activeRoute: ActivatedRoute, public router: Router, public utilsService: UtilsService, public apiService: ApiService) {
		
	}

	ngOnInit(): void {
		if (window.innerWidth > 991) this.toggle = false;
		else this.toggle = true;

		this.activeRoute.queryParams.subscribe(params => {
			this.category = params['category']
			this.categoryName = params['name']
			this.pageTitle = this.categoryName
		})
		this.activeRoute.params.subscribe(params => {
			this.type = params['type'];

			// if (this.type == 'list') {
			// 	this.pageTitle = 'List';
			// } else if (this.type == '2cols') {
			// 	this.pageTitle = 'Grid 2 Columns';
			// } else if (this.type == '3cols') {
			// 	this.pageTitle = 'Grid 3 Columns';
			// } else if (this.type == '4cols') {
			// 	this.pageTitle = 'Grid 4 Columns';
			// }
		});

		this.activeRoute.queryParams.subscribe(params => {
			if (params.page) {
				this.pageNumber = params.page
			} else {
				this.pageNumber = 1
			}
			this.loaded = true;

			if (params['searchTerm']) {
				this.searchTerm = params['searchTerm'];
			} else {
				this.searchTerm = '';
			}

			if (params['orderBy']) {
				this.orderBy = params['orderBy'];
			} else {
				this.orderBy = 'default';
			}

			this.storeService.getProductsByCategory(this.category, null, 0).then(value => {
				this.products = value.slice((this.pageNumber - 1) * this.perPage, (this.pageNumber) * this.perPage)
				// this.products
				this.totalCount = value.length
				this.loaded = true
				if (!this.firstLoad) {
					this.firstLoad = true;
				}
			})
			// this.apiService.fetchShopData(params, this.perPage).subscribe(result => {
			// 	this.products = result.products;
			// 	this.totalCount = result.totalCount;

			// 	this.loaded = true;
			// 	if (!this.firstLoad) {
			// 		this.firstLoad = true;
			// 	}

			// 	this.utilsService.scrollToPageContent();
			// })
		})
	}

	@HostListener('window: resize', ['$event'])
	onResize(event: Event) {
		if (window.innerWidth > 991) this.toggle = false;
		else this.toggle = true;
	}

	changeOrderBy(event: any) {
		this.router.navigate([], { queryParams: { orderBy: event.currentTarget.value, page: 1 }, queryParamsHandling: 'merge' });
	}

	toggleSidebar() {
		if (document.querySelector('body').classList.contains('sidebar-filter-active'))
			document.querySelector('body').classList.remove('sidebar-filter-active');
		else
			document.querySelector('body').classList.add('sidebar-filter-active');
	}

	hideSidebar() {
		document.querySelector('body').classList.remove('sidebar-filter-active');
	}
}