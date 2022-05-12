import { RegionCountry } from "./region";

export interface Store {
    id: string;
    name: string;
    storeDescription: string;
    address: string;
    paymentType: string;
    phoneNumber: string;
    postcode: string;
    city: string;
    clientId: string;
    domain: string;
    email: string;
    googleAnalyticId: string;
    isBranch: boolean;
    latitude: string;
    longitude: string;
    liveChatCsrGroupId: string;
    liveChatCsrGroupName: string;
    liveChatOrdersGroupId: string;
    liveChatOrdersGroupName: string;
    regionCountryId: string;
    regionCountryStateId: string;
    serviceChargesPercentage: number;
    snoozeEndTime: string;
    snoozeReason: string;
    snoozeStartTime: string;
    verticalCode: string;
    regionCountry: RegionCountry;
    storeTiming: StoreTiming[];
    storeAssets: StoreAssets[];
}

// export interface StoreAssets {
//     storeId: string;
//     bannerUrl: string;
//     bannerMobileUrl: string,
//     logoUrl: string;
//     qrCodeUrl: string;
//     assetUrl: string;
// }
export interface StoreAssets {
        id: string;
        storeId: string;
        assetUrl: string;
        assetDescription: string;
        assetType: string;
        assetFile: string;
    }

export interface StoreTiming {
    storeId: string;
    openTime: string;
    breakStartTime: string;
    breakEndTime: string;
    closeTime: string;
    day: string;
    isOff: boolean;
}