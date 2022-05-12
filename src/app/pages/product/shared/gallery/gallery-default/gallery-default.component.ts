import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';

import { Product } from 'src/app/shared/classes/product';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'product-gallery-default',
	templateUrl: './gallery-default.component.html',
	styleUrls: ['./gallery-default.component.scss']
})

export class GalleryDefaultComponent implements OnInit {

	@Input() product: any;
	@Input() adClass = 'product-gallery-vertical';

	paddingTop = '100%';
	pictures = []
	currentIndex = 0;
	album = [];
	lightBoxOption = {
		showImageNumberLabel: true,
		centerVertically: true,
		showZoom: true,
		fadeDuration: .2,
		albumLabel: "%1 / %2"
	}

	// SERVER_URL = environment.SERVER_URL;s

	constructor(public lightBox: Lightbox) { }

	@HostListener('window:resize', ['$event'])
	closeLightBox(event: Event) {
		this.lightBox.close();
	}

	ngOnChanges() {
		// this.album = [];

		// for (let i = 0; i < this.pictures.length; i++) {
		// 	this.album.push({
		// 		src: this.pictures[i],
		// 		thumb: this.pictures[i],
		// 		caption: this.product.name
		// 	});
		// }
		// this.album.push(this.product.thumbnailUrl)
	}

	ngOnInit(): void {
		this.product.productAssets.forEach(asset => {
			this.pictures.push(asset.url)
		});
		// this.paddingTop = Math.floor((parseFloat(this.product.thumbnailUrl.height.toString()) / parseFloat(this.product.thumbnailUrl.width.toString()) * 1000)) / 10 + '%';

	}

	changeImage($event: Event, index = 0) {
		this.currentIndex = index;
		$event.preventDefault();
	}

	openLightBox() {
		// this.lightBox.open(this.album, this.currentIndex, this.lightBoxOption);
	}
}