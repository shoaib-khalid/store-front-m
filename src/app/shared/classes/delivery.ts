export interface DeliveryCharge {
    deliveryType: string;
    isError: boolean;
    price: number;
    providerId: number;
    providerImage: string;
    providerName: string;
    refId: number;
    validUpTo: string;
}

export interface DeliveryDetails {
    deliveryContactName: string;
    deliveryAddress: string;
    deliveryPostcode: string;
    deliveryContactEmail: string;
    deliveryContactPhone: string;
    deliveryState: string;
    deliveryCity: string;
    deliveryCountry: string;
    deliveryNotes: string;
}