import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StoreService } from 'src/app/core/store/store.service';
import { CartTotals } from 'src/app/shared/classes/cart';
import { DeliveryCharge, DeliveryDetails } from 'src/app/shared/classes/delivery';
import { State } from 'src/app/shared/classes/region';
import { Store, StoreTiming } from 'src/app/shared/classes/store';
import { ApiService } from 'src/app/shared/services/api.service';

import { CartService } from 'src/app/shared/services/cart.service';

declare var $: any;

@Component({
	selector: 'shop-checkout-page',
	templateUrl: './checkout.component.html',
	styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit, OnDestroy {

	currency: string
	userDeliveryDetails: DeliveryDetails
	states: State[] = [];
	storeDeliveryPercentage: number;
	deliveryFee: DeliveryCharge = null
	hasDeliveryCharges: boolean = false
	submitButtonText: string
	cartTotals: CartTotals = null
	totalServiceCharge: number
	isProcessing: boolean = false
	storeInfo: Store
	
	openTime: string
	closeTime: string
	currentTime: string
	storeTiming: StoreTiming[]
	isClosed = false
	initlat = 33.6920052;
	initlng = 73.057033;
	lat = 33.6920052;
	lng = 73.057033;
	zoom = 20

	constructor(
		private toastrService: ToastrService,
		private router: Router,
		private apiService: ApiService,
		private storeService: StoreService,
		public cartService: CartService
	) {
		this.userDeliveryDetails = {
			deliveryContactName: "",
			deliveryAddress: "",
			deliveryPostcode: "",
			deliveryContactEmail: "",
			deliveryContactPhone: "",
			deliveryState: "",
			deliveryCity: "",
			deliveryCountry: "",
			deliveryNotes: "",
		}

		this.submitButtonText = "Get Delivery Charges";
	}

	async ngOnInit() {
		this.currency = this.storeService.getCurrency()
		await this.getStoreInfo();
		this.populate()
		this.isClosed = this.isStoreClosed()
		// this.getAddressFromLatlng(this.lat, this.lng)
		// this.mapsAPILoader.load().then(() => {
		// });

		document.querySelector('body').addEventListener("click", () => this.clearOpacity())
	}

	centerChanged(e) {
		this.lat = e.lat
		this.lng = e.lng
	}

	mapClicked(e) {
		this.lat = e.coords.lat
		this.lng = e.coords.lng
		// this.getAddressFromLatlng(this.lat, this.lng)
	}

	getAddressFromLatlng(lat, lng) {
		let latlng = new google.maps.LatLng(lat, lng)
		let geocoder = new google.maps.Geocoder()
		let request = {
			'location': latlng
		}
		geocoder.geocode(request, (results, status) => {
			if (status == google.maps.GeocoderStatus.OK) {
				let address = ''
				let city = ''
				let postCode = ''
				results.forEach(result => {
					if (result) {
						result.address_components.forEach(ac => {
							if (ac.types.includes('route')) {
								address = ac.long_name
							}
							if (ac.types.includes('administrative_area_level_2')) {
								city = ac.long_name
							}
							if (ac.types.includes('postal_code')) {
								postCode = ac.long_name
							}
						})
					}
				})
				this.userDeliveryDetails.deliveryAddress = address
				this.userDeliveryDetails.deliveryCity = city
				this.userDeliveryDetails.deliveryPostcode = postCode
				// this.selectState(results[0])
				// let address = results[0].address_components
				// let st = address[address.length-2].long_name
				// let value = address.split(',')
				// console.log(value[value.length-2])
				// this.userDeliveryDetails.deliveryState = value[value.length-2]
			}
		})
	}

	populate() {
		let days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
		let date = new Date()
		let today = days[date.getDay()]
		this.currentTime = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
		this.storeTiming = this.storeInfo.storeTiming

		for (let storeTime of this.storeTiming) {
			if (storeTime.day === today) {
				this.openTime = storeTime.openTime
				this.closeTime = storeTime.closeTime
			}
		}
	}

	isStoreClosed() {
		return (this.currentTime < this.openTime || this.currentTime > this.closeTime)
	}

	ngOnDestroy(): void {
		// this.subscr.unsubscribe();
		document.querySelector('body').removeEventListener("click", () => this.clearOpacity())
	}

	async getStoreInfo() {
		try {
			this.storeInfo = await this.storeService.getStoreInfo();
			this.userDeliveryDetails.deliveryCountry = this.storeInfo.regionCountry.name;
			this.storeDeliveryPercentage = this.storeInfo.serviceChargesPercentage;

			this.states = await this.getStatesByID(this.storeInfo.regionCountry.id);
		} catch (error) {
			console.error("Error getting storeInfo", error);
		}
	}

	selectState(e): void {
		this.userDeliveryDetails.deliveryState = e.target.value
		this.hasDeliveryCharges = false
		this.submitButtonText = "Get Delivery Charges"
	}

	getStatesByID(countryID): Promise<State[]> {
		return new Promise((resolve) => {
			this.apiService.getStateByCountryID(countryID).subscribe(
				async (res: any) => {
					if (res.status === 200) {
						resolve(res.data.content);
					}
				},
				(error) => {
					console.error(error);
					resolve(error);
				}
			);
		});
	}

	async onSubmit() {
		this.isProcessing = true;
		if (this.hasDeliveryCharges) {
			const codResult: any = await this.cartService.confirmCashOnDelivery(
				this.userDeliveryDetails,
				this.deliveryFee
			);
			if (codResult.status === 201) {
				this.isProcessing = false;
				await this.toastrService.success('Order placed successfully')
				this.router.navigate(["/pages/thankyou"]);
			} else {
				this.toastrService.error('Could not Place Order. Try again.')
				// TODO: Show error message
				this.isProcessing = false;
			}
		} else {
			this.deliveryFee = await this.cartService.getDeliveryFee(
				this.userDeliveryDetails
			);
			this.cartTotals = await this.cartService.getDiscount(
				this.deliveryFee.price
			);

			if (this.deliveryFee.isError) {
				this.toastrService.error('Out of Service Area')
				this.isProcessing = false;
			} else {
				this.hasDeliveryCharges = this.cartTotals ? true : false;
				this.totalServiceCharge = (this.storeDeliveryPercentage / 100) * this.cartTotals.cartSubTotal;
				this.submitButtonText = "Place Order";
				this.isProcessing = false;
			}
		}
	}


	clearOpacity() {
		let input: any = document.querySelector('#checkout-discount-input');
		if (input && input.value == "") {
			let label: any = document.querySelector('#checkout-discount-form label');
			label.removeAttribute('style');
		}
	}

	addOpacity(event: any) {
		event.target.parentElement.querySelector("label").setAttribute("style", "opacity: 0");
		event.stopPropagation();

	}

	formToggle(event: any) {
		const parent: HTMLElement = event.target.closest('.custom-control');
		const submenu: HTMLElement = parent.closest('.form-group').querySelector('.shipping-info');

		if (parent.classList.contains('open')) {
			$(submenu).slideUp(300, function () {
				parent.classList.remove('open');
			});
		}
		else {
			$(submenu).slideDown(300, function () {
				parent.classList.add('open');
			});
		}

		event.preventDefault();
		event.stopPropagation();
	}
}
