import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UtilsService } from 'src/app/shared/services/utils.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { StoreService } from 'src/app/core/store/store.service';
import { Store } from 'src/app/shared/classes/store';
import { Time } from '@angular/common';

@Component({
	selector: 'molla-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

	@Input() containerClass = "container";

	storeInfo: Store
	openTime: string
	closeTime: string
	wishCount = 0;
	logoUrl: string
	currentTime: string
	isClosed = false
	phoneNumber: string

	constructor(private storeService: StoreService, public activeRoute: ActivatedRoute, public utilsService: UtilsService, public modalService: ModalService) {
	}

	async ngOnInit() {

		await this.storeService.parseStoreFromUrl()

		this.storeService.getStoreInfoByStoreId().then(
			(value) => {
				this.storeInfo = value
				this.populate()
				this.isClosed = this.isStoreClosed()
				this.phoneNumber = this.storeInfo.phoneNumber
			}
		)
	}
	populate() {
		let days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
		let date = new Date()
		let today = days[date.getDay()]
		this.currentTime = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')

		for (let storeTime of this.storeInfo.storeTiming) {
			if (storeTime.day === today) {
				this.openTime = storeTime.openTime
				this.closeTime = storeTime.closeTime
			}
		}
		for (let asset of this.storeInfo.storeAssets) {
			if (asset.assetType === 'LogoUrl') {
				this.logoUrl = asset.assetUrl;
			}
		}
	}

	showLoginModal(event: Event): void {
		// event.preventDefault();
		// this.modalService.showLoginModal();
	}

	isStoreClosed() {
		return (this.currentTime < this.openTime || this.currentTime > this.closeTime)
	}
}
