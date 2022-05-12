import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Category } from '../classes/category';

@Injectable({
	providedIn: 'root'
})

export class ApiService {

	productServiceURL = 'https://api.symplified.it/product-service/v1/'
	orderServiceURL = 'https://api.symplified.it/order-service/v1/'
	deliveryServiceURL = 'https://api.symplified.it/delivery-service/v1/'
	token = 'accessToken'

	constructor(private http: HttpClient) {
	}

	/**
	 * Get Products
	 */
	public fetchShopData(params: any, perPage: number, initial = 'shop'): Observable<any> {
		let temp = initial;
		if (!initial.includes('?')) {
			temp += '?';
		}

		for (let key in params) {
			temp += key + '=' + params[key] + '&';
		}

		if (!params.page) {
			temp += 'page=1';
		}

		if (!params.perPage) {
			temp += '&perPage=' + perPage;
		}

		temp += '&demo=' + environment.demo;

		return this.http.get(`${environment.SERVER_URL}/${temp}`);
	}

	/**
	 * Get Products
	 */
	public fetchBlogData(params: any, initial = 'blogs/classic', perPage: number,): Observable<any> {
		let temp = initial;
		if (!initial.includes('?')) {
			temp += '?';
		}

		for (let key in params) {
			temp += key + '=' + params[key] + '&';
		}

		if (!params.page) {
			temp += 'page=1';
		}

		if (!params.perPage) {
			temp += '&perPage=' + perPage;
		}

		return this.http.get(`${environment.SERVER_URL}/${temp}`);
	}

	/**
	 * Get Products
	 */
	public fetchSinglePost(slug: string): Observable<any> {
		return this.http.get(`${environment.SERVER_URL}/${'single/' + slug + '?demo=' + environment.demo}`);
	}

	/**
	 * Get Products for home page
	 */
	public fetchHomeData(): Observable<any> {
		return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
	}

	/**
	 * Get products by demo
	 */
	public getSingleProduct(slug: string, isQuickView = false): Observable<any> {
		return this.http.get(`${environment.SERVER_URL}/products/${slug}?demo=${environment.demo}&isQuickView=${isQuickView}`);
	}

	/**
	 * Get Products
	 */
	public fetchHeaderSearchData(searchTerm: string, cat = null): Observable<any> {
		return this.http.get(`${environment.SERVER_URL}/shop?perPage=5&searchTerm=${searchTerm}&category=${cat}&demo=${environment.demo}`);
	}

	/**
	 * Get Element Products
	 */
	public fetchElementData(): Observable<any> {
		return this.http.get(`${environment.SERVER_URL}/elements/products`);
	}

	/**
	 * Get Element Blog
	 */
	public fetchElementBlog(): Observable<any> {
		return this.http.get(`${environment.SERVER_URL}/elements/blogs`);
	}

	getStoreInfoByID(storeID: string) {
		const header = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				Authorization: "Bearer accessToken",
			}),
		};
		const url = this.productServiceURL + "stores/" + storeID;

		return this.http.get(url, header);
	}

	getStoreInfoByDomainName(domainName: string) {
		const header = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.token}`,
			}),
			params: {
				domain: domainName,
			},
		};

		const url = this.productServiceURL + "stores";

		return this.http.get(url, header);
	}

	getCategoryById(categoryId): Observable<Category> {
		const header = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.token}`,
			}),
		}
		const url = this.productServiceURL + "store-categories/" + categoryId

		return this.http.get<Category>(url, header)
	}

	getCategoryByName(name, storeID): Observable<Category[]> {
		const header = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.token}`,
			}),
			params: {
				name: name,
				storeId: storeID
			},
		};
		const url =
			this.productServiceURL +
			"store-categories"

		return this.http.get<Category[]>(url, header)
	}

	getCategoryByStoreID(storeID): Observable<Category[]> {
		const header = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.token}`,
			}),
		};
		const url =
			this.productServiceURL +
			"store-categories?storeId=" +
			storeID;
		return this.http.get<Category[]>(url, header);
	}

	getProductSByStoreID(storeID): Observable<any> {
		const header = {
			headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
		};
		const url =
			this.productServiceURL +
			"stores/" +
			storeID +
			"/products?pageSize=10" +
			"&page=0" +
			"&status=ACTIVE";

		return this.http.get(url, header);
	}

	getStoreHoursByID(storeID) {
		const header = {
			headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
		};
		const url = this.productServiceURL + "stores/" + storeID;

		return this.http.get(url, header);
	}

	getProductsByName(name, store_id) {
		const header = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.token}`,
			}),
		};

		const url =
			this.productServiceURL +
			"stores/" +
			store_id +
			"/products?featured=true" +
			"&seoName=" +
			name;

		return this.http.get(url, header);
	}

	getProductSByCategory(categoryId, storeID, sortId, pageNo) {
		const header = {
			headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
		};

		// Endpoint: http://localhost:7071/stores/storeId/products?sortByCol=price&sortingOrder=DESC

		let url = "";
		if (categoryId != null) {
			if (sortId == 1) {
				// cheapest
				url =
					"stores/" +
					storeID +
					"/products?status=ACTIVE" +
					"&page=" +
					pageNo +
					"&categoryId=" +
					categoryId +
					"&sortByCol=price" +
					"&sortingOrder=ASC";
			} else if (sortId == 2) {
				// expensive
				url =
					"stores/" +
					storeID +
					"/products?status=ACTIVE" +
					"&page=" +
					pageNo +
					"&categoryId=" +
					categoryId +
					"&sortByCol=price" +
					"&sortingOrder=DESC";
			} else if (sortId == 3) {
				// by A-Z
				url =
					"stores/" +
					storeID +
					"/products?status=ACTIVE" +
					"&page=" +
					pageNo +
					"&categoryId=" +
					categoryId +
					"&sortingOrder=ASC";
			} else if (sortId == 4) {
				// by Z-A
				url =
					"stores/" +
					storeID +
					"/products?status=ACTIVE" +
					"&page=" +
					pageNo +
					"&categoryId=" +
					categoryId +
					"&sortingOrder=DESC";
			} else if (sortId == 5) {
				// by Most Recent
				url =
					"stores/" +
					storeID +
					"/products?status=ACTIVE" +
					"&page=" +
					pageNo +
					"&categoryId=" +
					categoryId +
					"&sortByCol = created" +
					"&sortingOrder=DESC";
			} else {
				// non sorted
				url =
					"stores/" +
					storeID +
					"/products?status=ACTIVE" +
					"&categoryId=" +
					categoryId +
					"&page=" +
					pageNo;
			}
		} else {
			if (sortId == 1) {
				// cheapest
				url =
					"stores/" +
					storeID +
					"/products?status=ACTIVE" +
					"&page=" +
					pageNo +
					"&sortByCol=price" +
					"&sortingOrder=ASC";
			} else if (sortId == 2) {
				// expensive
				url =
					"stores/" +
					storeID +
					"/products?status=ACTIVE" +
					"&page=" +
					pageNo +
					"&sortByCol=price" +
					"&sortingOrder=DESC";
			} else if (sortId == 3) {
				// by A-Z
				url =
					"stores/" +
					storeID +
					"/products?status=ACTIVE" +
					"&page=" +
					pageNo +
					"&sortingOrder=ASC";
			} else if (sortId == 4) {
				// by Z-A
				url =
					"stores/" +
					storeID +
					"/products?status=ACTIVE" +
					"&page=" +
					pageNo +
					"&sortingOrder=DESC";
			} else if (sortId == 5) {
				// by Most Recent
				url =
					"stores/" +
					storeID +
					"/products?status=ACTIVE" +
					"&page=" +
					pageNo +
					"&sortByCol = created" +
					"&sortingOrder=DESC";
			} else {
				// non sorted
				url =
					"stores/" + storeID + "/products?status=ACTIVE" + "&page=" + pageNo;
			}
		}

		return this.http.get(this.productServiceURL + url, header);
	}

	getCartItemByCartID(cartID) {
		const header = {
			headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
		};
		// http://209.58.160.20:7072/carts/3/items?page=0&pageSize=20
		const url =
			this.orderServiceURL +
			"carts/" +
			cartID +
			"/items?page=0" +
			"&pageSize=200";

		return this.http.get(url, header);
	}

	postCreateCart(data): Observable<any> {
		// data sample : { "created": "2021-05-26T01:59:19.698Z", "customerId": "string", "id": "string", "isOpen": true, "storeId": "string", "updated": "2021-05-26T01:59:19.699Z"}
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: `Bearer ${this.token}`,
				"Content-Type": "application/json",
			}),
		};

		const url = this.orderServiceURL + "carts";
		return this.http.post(url, data, httpOptions);
	}

	postAddToCart(data): Observable<any> {
		// data sample : { "cartId": "string", "id": "string", "itemCode": "string", "price": 0, "productId": "string", "productPrice": 0, "quantity": 0, "sku": "string", "weight": 0}
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: `Bearer ${this.token}`,
				"Content-Type": "application/json",
			}),
		};

		const url = this.orderServiceURL + "carts/" + data.cartId + "/items";

		return this.http.post(url, data, httpOptions);
	}

	putCartItem(data): Observable<any> {
		// data sample : { "cartId": "string", "itemId": "string", "operation": "string" }
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: `Bearer ${this.token}`,
				"Content-Type": "application/json",
			}),
		};

		const url =
			this.orderServiceURL + "carts/" + data.cartId + "/items/" + data.id;

		return this.http.put(url, data, httpOptions);
	}

	deleteCartItemID(data, id): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: `Bearer ${this.token}`,
				"Content-Type": "application/json",
			}),
			body: data,
		};

		const url = this.orderServiceURL + "carts/" + data.cartId + "/items/" + id;

		return this.http.delete(url, httpOptions);
	}

	getStateByCountryID(countryID) {
		const header = {
			headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
		};
		const url =
			this.productServiceURL +
			"region-country-state?regionCountryId=" +
			countryID;

		return this.http.get(url, header);
	}

	postTogetDeliveryFee(data): Observable<any> {
		// data : { "customerId": "string", "delivery": { "deliveryAddress": "string", "deliveryCity": "string", "deliveryContactEmail": "string", "deliveryContactName": "string", "deliveryContactPhone": "string", "deliveryCountry": "string", "deliveryPostcode": "string", "deliveryState": "string" }, "deliveryProviderId": 0, "insurance": true, "itemType": "parcel", "merchantId": 0, "orderId": "string", "pickup": { "parcelReadyTime": "string", "pickupAddress": "string", "pickupCity": "string", "pickupContactEmail": "string", "pickupContactName": "string", "pickupContactPhone": "string", "pickupCountry": "string", "pickupDate": "string", "pickupLocationId": 0, "pickupOption": "string", "pickupPostcode": "string", "pickupState": "string", "pickupTime": "string", "remarks": "string", "trolleyRequired": true, "vehicleType": "CAR" }, "pieces": 0, "productCode": "string", "shipmentContent": "string", "shipmentValue": 0, "storeId": "string", "totalWeightKg": 0, "transactionId": "string"}
		const httpOptions = {
			headers: new HttpHeaders({
				"Authorization": `Bearer ${this.token}`,
				"Content-Type": "application/json",
			}),
		};

		const url = this.deliveryServiceURL + "orders/getprice";

		return this.http.post(url, data, httpOptions);
		// return this.http.get(this.payServiceURL + "payments/makePayment", httpOptions);
	}

	getDeliveryOption(storeID) {
		const header = {
			headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
		};
		const url =
			this.productServiceURL + "stores/" + storeID + "/deliverydetails";
		return this.http.get(url, header);
	}

	postConfirmCOD(data, cartId, saveInfo): Observable<any> {
		// data sample : { "created": "2021-05-26T01:59:19.698Z", "customerId": "string", "id": "string", "isOpen": true, "storeId": "string", "updated": "2021-05-26T01:59:19.699Z"}
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: `Bearer ${this.token}`,
				"Content-Type": "application/json",
			}),
		};

		// const url = "http://209.58.160.20:7001/orders/placeOrder?cartId=" + cartId;
		const url =
			this.orderServiceURL +
			"orders/placeOrder?cartId=" +
			cartId +
			"&saveCustomerInformation=" +
			saveInfo;
		return this.http.post(url, data, httpOptions);
	}

	getDiscount(cartId, deliveryCharge) {
		const header = {
			headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
		};
		const url =
			this.orderServiceURL +
			"carts/" +
			cartId +
			"/discount?deliveryCharge=" +
			deliveryCharge;

		return this.http.get(url, header);
	}
}
