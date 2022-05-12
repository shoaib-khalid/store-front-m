import { Component, OnInit, Input } from '@angular/core';

import { Product } from '../../classes/product';

import { environment } from 'src/environments/environment';
import { Category } from '../../classes/category';

@Component({
	selector: 'molla-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.scss']
})

export class BreadcrumbComponent implements OnInit {

	@Input() prev: Product;
	@Input() category: Category
	@Input() next: Product;
	@Input() current: any;
	@Input() fullWidth = false;

	SERVER_URL = environment.SERVER_URL;

	constructor() {
	}

	ngOnInit(): void {
	}
}