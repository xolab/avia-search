export enum SortOrder {
  PRICEUP = 'priceUp',
  PRICEDOWN = 'priceDown',
  DURATION ='duration',
}

export type Filters = {
  sortOrder: SortOrder,
  numberSegments: string[],
  priceFrom: string,
  priceUpTo: string,
}
