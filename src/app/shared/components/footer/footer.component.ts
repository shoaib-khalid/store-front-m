import { Component, OnInit, Input } from '@angular/core';
import { StoreService } from 'src/app/core/store/store.service';
import { Store } from '../../classes/store';

@Component({
	selector: 'molla-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {

	@Input() containerClass = "container";
	@Input() isBottomSticky = false;

	storeInfo: Store
	phoneNumber: string
	email: string

	year: any;

	constructor( private storeService: StoreService) {
	}

	async ngOnInit() {

		await this.storeService.parseStoreFromUrl()

		this.storeService.getStoreInfoByStoreId().then(
			(value) => {
				this.storeInfo = value
				this.phoneNumber = value.phoneNumber
				this.email = value.email
			}
		)
		this.year = (new Date()).getFullYear();
	}
}
