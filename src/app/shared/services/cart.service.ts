import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// RxJS
import { Subject, BehaviorSubject } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';

import { Product } from 'src/app/shared/classes/product';
// import { CartItem } from 'src/app/shared/classes/cart-item';
import { CartItem, CartItemRequest, CartTotals } from '../classes/cart';
import { cartItemsSelector } from 'src/app/core/selectors/selectors';
import { AddToCartAction, RemoveFromCartAction, UpdateCartAction } from 'src/app/core/actions/actions';
import { StoreService } from 'src/app/core/store/store.service';
import { ApiService } from './api.service';
import { DeliveryCharge, DeliveryDetails } from '../classes/delivery';

@Injectable({
	providedIn: 'root'
})

export class CartService {

	private cartIdKey = 'anonym_cart_id';

	public cart: CartItem[] = [];
	public cartStream: Subject<any> = new BehaviorSubject([]);
	public qtyTotal: number = 0
	public priceTotal: number = 0;

	cartChange: Subject<CartItem[]> = new Subject<CartItem[]>();

	constructor(
		private toastrService: ToastrService,
		private storeService: StoreService,
		private apiService: ApiService
	) {

		this.getCartItems()
		storeService.storeIdChange.subscribe(storeId => {
			this.removeCart()
		})

		// store.pipe(select(cartItemsSelector)).subscribe(items => {
		// 	this.cartItems = items;

		// 	this.cartStream.next(items);

		// 	this.qtyTotal.next(
		// 		this.cartItems.reduce((acc, cur) => {
		// 			return acc + cur.qty
		// 		}, 0));

		// 	this.priceTotal.next(
		// 		this.cartItems.reduce((acc, cur) => {
		// 			return acc + cur.sum
		// 		}, 0)
		// 	)
		// })
	}

	private setCartId(cardId: string) {
		localStorage.setItem(this.cartIdKey, cardId)
	}

	public getCartId() {
		return localStorage.getItem(this.cartIdKey);
	}

	private removeCart() {
		localStorage.removeItem(this.cartIdKey)
		this.cart = []
		this.priceTotal = 0
		this.qtyTotal = 0
		this.cartChange.next(this.cart)
	}

	getCartItems() {
		if (this.getCartId()) {
			this.apiService.getCartItemByCartID(this.getCartId()).subscribe(
				(res: any) => {
					this.cart = res.data.content
					this.qtyTotal = this.cart.length
					this.priceTotal = 0
					this.cart.forEach(item => {
						this.priceTotal += item.productPrice * item.quantity
					})
					this.cartChange.next(this.cart)
				},
				error => {
					console.log('Failed to get cart items', error)
				}
			)
		}
	}

	createCart() {
		const data = {
			storeId: this.storeService.getStoreId()
		};

		return new Promise((resolve, reject) => {
			this.apiService.postCreateCart(data).subscribe((res: any) => {
				resolve(res.data);
				this.setCartId(res.data.id);
				this.getCartItems();
			}, error => {
				console.error("Failed to create cart", error);
				reject(error);
			});
		});
	}

	async addToCart(product: any, quantity: number) {

		if (this.canAddToCart(product, quantity)) {
			if (!this.getCartId()) {
				await this.createCart()
			}
			const cartItemRequest: CartItemRequest = {
				cartId: this.getCartId(),
				SKU: product.productInventories[0].sku,
				itemCode: product.productInventories[0].itemCode,
				price: product.price,
				productId: product.id,
				productPrice: product.price,
				quantity: quantity,
				specialInstruction: ''
			}

			return new Promise((resolve, reject) => {
				this.apiService.postAddToCart(cartItemRequest).subscribe(
					(res: any) => {
						resolve(res)
						this.getCartItems()
					},
					error => {
						console.log('Error adding to cart', error)
						reject(error)
					}
				)
			})
		} else {
			this.toastrService.error('Sorry, you can\'t add that amount to the cart.')
		}
	}

	putCartItem(cartItem: CartItem) {
		if (!this.getCartId()) {
			return this.addToCart(cartItem.productInventory.product, cartItem.quantity);
		} else {
			return new Promise((resolve, reject) => {
				this.apiService.putCartItem(cartItem).subscribe((res: any) => {
					resolve(res);
					this.getCartItems();
				}, error => {
					console.error("Error putting cart item", error);
					reject(error);
				})
			});
		}
	}

	deleteCartItem(cartItem: CartItem, index: number) {
		this.cart = this.cart.splice(index, 1);

		return new Promise((resolve, reject) => {
			this.apiService.deleteCartItemID(cartItem, cartItem.id).subscribe((res: any) => {
				resolve(res);
				this.getCartItems();
				this.toastrService.success('Product removed from Cart.')
			}, error => {
				console.error("Error deleting cart item", error);
				reject(error);
				this.toastrService.error('Can\'t remove item from cart')
			})
		});
	}

	getSubTotal() {
		return this.cart.reduce((subtotal: number, item: CartItem) => subtotal + item.price, 0);
	}



	// Product Add to Cart
	// addToCart(product: Product, qty = 1) {
	// 	if (this.canAddToCart(product, qty)) {
	// 		this.store.dispatch(new AddToCartAction({ product, qty }));
	// 		this.toastrService.success('Product added to Cart.');
	// 	} else {
	// 		this.toastrService.error('Sorry, you can\'t add that amount to the cart.');
	// 	}
	// }

	// // Product Removed from the Cart
	// removeFromCart(product: CartItem) {
	// 	this.store.dispatch(new RemoveFromCartAction({ product }));
	// 	this.toastrService.success('Product removed from Cart.');
	// }

	// // Cart update
	// updateCart(cartItems: CartItem[]) {
	// 	this.store.dispatch(new UpdateCartAction({ cartItems }));
	// 	this.toastrService.success('Cart Updated.');
	// }

	// // Check whether product is in Cart or not
	// isInCart(product: Product): boolean {
	// 	return this.cartItems.find(item => item.id == product.id) ? true : false;
	// }

	// // Check where product could be added to the cart
	canAddToCart(product: any, qty = 1) {
		var find = this.cart.find(item => item.productId == product.id);

		if (find) {
			if (product.productInventories[0].quantity < (find.quantity + qty)) return false;
			else return true;
		} else {
			if (product.productInventories[0].quantity < qty) return false;
			else return true;
		}
	}

	getDeliveryFee(DeliveryDetails: DeliveryDetails): Promise<DeliveryCharge> {
		let data = {
			cartId: this.getCartId(),
			customerId: null,
			delivery: DeliveryDetails,
			deliveryProviderId: null,
			storeId: this.storeService.getStoreId()
		};

		return new Promise((resolve, reject) => {
			this.apiService.postTogetDeliveryFee(data).subscribe(async (res: any) => {
				if (Array.isArray(res.data)) {
					resolve(res.data[0]);
				} else {
					resolve(res.data);
				}
			}, error => {
				console.error("Error posting to delivery", error);
				reject(error);
			})
		});
	}

	getDiscount(deliveryCharge): Promise<CartTotals> {
		return new Promise((resolve, reject) => {
			this.apiService.getDiscount(this.getCartId(), deliveryCharge).subscribe(async (res: any) => {
				resolve(res.data);
			}, error => {
				console.error("Error getting discount", error);
				reject(error);
			})
		})
	}

	async confirmCashOnDelivery(deliveryDetails: DeliveryDetails, deliveryFee: DeliveryCharge) {
		const deliveryOption: any = await this.storeService.getDeliveryOption();

		const data = {
			cartId: this.getCartId(),
			customerId: null,
			customerNotes: deliveryDetails.deliveryNotes,
			orderPaymentDetails: {
				accountName: deliveryDetails.deliveryContactName,
				deliveryQuotationAmount: deliveryFee.price,
				deliveryQuotationReferenceId: deliveryFee.refId,
				gatewayId: ""
			},
			orderShipmentDetails: {
				address: deliveryDetails.deliveryAddress,
				city: deliveryDetails.deliveryCity,
				country: deliveryDetails.deliveryCountry,
				email: deliveryDetails.deliveryContactEmail,
				phoneNumber: deliveryDetails.deliveryContactPhone,
				receiverName: deliveryDetails.deliveryContactName,
				state: deliveryDetails.deliveryState,
				zipcode: deliveryDetails.deliveryPostcode,
				deliveryProviderId: deliveryFee.providerId,
				deliveryType: deliveryOption.type
			}
		}

		return new Promise((resolve, reject) => {
			this.apiService.postConfirmCOD(data, data.cartId, false).subscribe((res: any) => {
				resolve(res);
				if (res.status === 201) {
					this.removeCart();
				}
			}, error => {
				console.error("Error confirming Cash on Delivery", error);
				reject(error);
			});
		})
	}
}