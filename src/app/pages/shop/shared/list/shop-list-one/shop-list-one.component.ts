import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'molla-shop-list-one',
	templateUrl: './shop-list-one.component.html',
	styleUrls: ['./shop-list-one.component.scss']
})

export class ShopListOneComponent implements OnInit {

	@Input() type: string;
	@Input() products = [];
	@Input() loaded = false;

	grid = {
		"2cols": "col-6",
		"3cols": "col-6 col-md-4 col-lg-4",
		"4cols": "col-6 col-md-4 col-lg-4 col-xl-3"
	};

	constructor() {
	}

	ngOnInit(): void {
	}
}