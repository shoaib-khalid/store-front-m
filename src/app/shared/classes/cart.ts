import { ProductInventory } from "./product";

export interface Cart {
    id: string;
    customerId: string;
    storeId: string;
    isOpen: boolean;
}

export interface CartItem {
    SKU: string,
    cartId: string,
    discountCalculationType: string,
    discountCalculationValue: string,
    discountId: number,
    discountLabel: number,
    id: string,
    itemCode: string,
    price: number,
    productId: string,
    productName: string,
    productPrice: number,
    quantity: number,
    specialInstruction: string,
    weight: number,

    productInventory: ProductInventory,
}

export interface CartSubItem {
    id: string;
    quantity: number;
    cartItemId: string;
    productId: string;
    itemCode: string;
    price: number;
    productPrice: number;
    weight: number;
    SKU: string;
    productName: string;
    specialInstruction: string;
}

export interface CartItemRequest {
    cartId: string;
    SKU: string;
    itemCode: string;
    price: number;
    productId: string;
    productPrice: number;
    quantity: number;
    specialInstruction: string;
}

export interface CartTotals {
    discountId: string;
    cartDeliveryCharge: number;
    cartGrandTotal: number;
    cartSubTotal: number;
    deliveryDiscount: number;
    deliveryDiscountDescription: string;
    deliveryDiscountMaxAmount: number;
    discountCalculationType: string;
    discountCalculationValue: number;
    discountMaxAmount: number;
    discountType: string;
    storeServiceCharge: number;
    storeServiceChargePercentage: number;
    subTotalDiscount: number;
    subTotalDiscountDescription: string;
}