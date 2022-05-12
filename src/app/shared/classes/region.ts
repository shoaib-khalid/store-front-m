export interface RegionCountry {
    id: string;
    name: string;
    region: string;
    timezone: string;
    currency: string;
    currencyCode: string;
    currencySymbol: string;
}

export interface State {
    id: string;
    name: string;
    regionCountryId: string;
}