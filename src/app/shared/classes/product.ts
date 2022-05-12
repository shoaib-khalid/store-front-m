export interface Product {
	id?: number;
	name?: string;
	slug?: string;
	price?: number;
	sale_price?: number;
	review?: number;
	ratings?: number;
	until?: string;
	stock?: number;
	top?: boolean;
	featured?: boolean;
	new?: boolean;
	short_desc?: boolean;
	category?: Array<{
		name?: string;
		slug?: string;
	}>;
	pictures?: Array<{
		width?: number;
		height?: number;
		url: number;
	}>;
	sm_pictures?: Array<{
		width?: number;
		height?: number;
		url?: number;
	}>
	variants?: Array<{
		color?: string;
		color_name?: string;
		price?: number;
		size?: Array<{
			name?: string;
		}>
	}>
	sold?: number;
}

export class ProductInventory {
    itemCode: string;
    price: number;
    quantity: number;
    productId: string;
    sku: string;
    productInventoryItems: ProductInventoryItem[];
    product: any;
}

export class ProductInventoryItem {
    itemCode: string;
    productVariantAvailableId: string;
}