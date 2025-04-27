export enum RentalLocation {
  WITHIN_CITY = "WITHIN_CITY",
  OUTSIDE_CITY = "OUTSIDE_CITY",
  IN_STORE = "IN_STORE",
}

export interface RentalOrder {
  clientId: string;
  computerCount: number;
  initialDays: number;
  additionalDays: number;
  location: RentalLocation;
}

export interface PriceSummary {
  basePrice: number;
  locationAdjustment: number;
  additionalDaysDiscount: number;
  totalPrice: number;
}
