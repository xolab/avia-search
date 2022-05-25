export type FlightData = {
  id: number,
  legFrom: any[],
  legTo: any[],
  name: string,
  price: number,
  totalDuration: number,
  totalSegments: number,
}

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

export type FlightFilters = CommonFilters & {
  carrierNames: string[];
};
