// LocationDetails.ts
export class LocationDetails {
}

export interface LocationDetails {
  location?: {
    latitude?: number[];
    longitude?: number[];
    // Add other properties as needed
  };
  // Add other properties as needed
}

export interface Location {
  address: string[];
  adminDistrict: any[];
  adminDistrictCode: any[];
  city: string[];
  country: string[];
  countryCode: string[];
  displayName: string[];
  displayContext: string[];
  ianaTimeZone: string[];
  latitude: number[];
  locale: Locale[];
  longitude: number[];
  neighborhood: any[];
  placeId: string[];
  postalCode: string[];
  postalKey: string[];
  disputedArea: boolean[];
  disputedCountries: any[];
  disputedCountryCodes: any[];
  disputedCustomers: any[];
  disputedShowCountry: boolean[][];
  iataCode: string[];
  icaoCode: string[];
  locId: string[];
  locationCategory: any[];
  pwsId: string[];
  type: string[];
}

export interface Locale {
  locale1: any;
  locale2: string;
  locale3: any;
  locale4: any;
}
