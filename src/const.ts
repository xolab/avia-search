export enum SortOrder {
  PRICEUP = 'priceUp',
  PRICEDOWN = 'priceDown',
  DURATION ='duration',
}

export type CommonFilters = {
  sortOrder: SortOrder,
  numberSegments: string[],
  priceFrom: string,
  priceUpTo: string,
}

export type Carrier = {
  name: string;
  price: number;
  enabled: boolean;
};

export type FlightFilters = CommonFilters & {
  carrierNames: string[];
};
